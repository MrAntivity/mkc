export type Rule = {
  category?: string;
  option?: string;
  options?: string[];
  operator?: string;
  type?: string;
};
export type Logic = { action: string; rules: Rule[] } | null;
export type Choice = {
  id: string;
  label: string;
  value?: unknown;
  price: number | string;
  inStock: boolean;
  logic: Logic;
  settings: {
    inputLengthValue?: number;
    inputMinLengthValue?: number;
    chargePerCharacter?: boolean;
    countSpaceAsCharacter?: boolean;
    useCustomCharacterPrcies?: boolean;
  };
};
export type Field = {
  id: string;
  title: string;
  type: string;
  display?: string;
  description: string;
  required: boolean;
  logic: Logic;
  options: Choice[];
};
export type Panel = {
  id: string;
  title: string;
  logic: Logic;
  fields: Field[];
};
export type ProductOptions = {
  source: string;
  basePrice: number | string;
  panels: Panel[];
};
export type Values = Record<string, string>;

// Rules are data, never evaluated as JavaScript. AND takes precedence over OR.
export function isVisible(logic: Logic, values: Values): boolean {
  if (!logic?.rules?.length) return true;
  let group = true,
    result = false;
  logic.rules.forEach((rule, index) => {
    const selected = values[rule.category ?? ""] ?? "";
    const match =
      rule.option === "any"
        ? Boolean(selected)
        : rule.option === "oneof"
          ? (rule.options ?? []).includes(selected)
          : rule.option === "isnot"
            ? Boolean(selected) && !(rule.options ?? []).includes(selected)
            : Boolean(selected) && selected === rule.option;
    if (index && rule.operator !== "&&") {
      result ||= group;
      group = match;
    } else group &&= match;
  });
  const matched = result || group;
  return logic.action === "hide" ? !matched : matched;
}
export function visiblePanels(config: ProductOptions, values: Values) {
  return config.panels
    .filter((p) => isVisible(p.logic, values))
    .map((p) => ({
      ...p,
      fields: p.fields
        .filter((f) => isVisible(f.logic, values))
        .map((f) => ({
          ...f,
          options: f.options.filter((o) => isVisible(o.logic, values)),
        })),
    }))
    .filter((p) => p.fields.length);
}
export function isTextField(field: Field) {
  return field.type === "input" || field.type === "fileUpload";
}
export function cleanValues(config: ProductOptions, values: Values): Values {
  let next = { ...values };
  for (
    let pass = 0;
    pass <= config.panels.flatMap((p) => p.fields).length;
    pass++
  ) {
    const allowed = new Map(
      visiblePanels(config, next)
        .flatMap((p) => p.fields)
        .map((f) => [f.id, f]),
    );
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([key, value]) => {
        const field = allowed.get(key);
        return (
          field &&
          (isTextField(field) ||
            field.type === "wholesaleOrder" ||
            field.options.some((o) => o.id === value && o.inStock))
        );
      }),
    );
    if (JSON.stringify(next) === JSON.stringify(cleaned)) return cleaned;
    next = cleaned;
  }
  return next;
}
export function optionCost(field: Field, value: string): number {
  if (!value || field.type === "wholesaleOrder") return 0;
  const option = isTextField(field)
    ? field.options[0]
    : field.options.find((o) => o.id === value);
  if (!option) return 0;
  const price = Number(option.price) || 0;
  return option.settings.chargePerCharacter
    ? price *
        Array.from(
          option.settings.countSpaceAsCharacter
            ? value
            : value.replace(/\s/g, ""),
        ).length
    : price;
}
export function selectionSummary(config: ProductOptions, values: Values) {
  return visiblePanels(config, values).flatMap((panel) =>
    panel.fields
      .filter((f) => values[f.id])
      .map((field) => ({
        id: field.id,
        name: `${panel.title} / ${field.title}`,
        value:
          isTextField(field) || field.type === "wholesaleOrder"
            ? values[field.id]
            : (field.options.find((o) => o.id === values[field.id])?.label ??
              ""),
      })),
  );
}

export function validateSelections(
  config: ProductOptions,
  values: Values,
): { id: string; message: string } | undefined {
  for (const field of visiblePanels(config, values).flatMap((p) => p.fields)) {
    const value = values[field.id] ?? "";
    if (field.required && !value.trim())
      return { id: field.id, message: `Please complete ${field.title}.` };
    if (field.type === "input" && value) {
      const settings = field.options[0]?.settings;
      if (value.length > (settings?.inputLengthValue ?? 100))
        return {
          id: field.id,
          message: `${field.title} exceeds its character limit.`,
        };
      if (value.length < (settings?.inputMinLengthValue ?? 0))
        return {
          id: field.id,
          message: `${field.title} needs at least ${settings?.inputMinLengthValue} characters.`,
        };
    }
  }
}
