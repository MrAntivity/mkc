"use client";
import { useSearchParams } from "next/navigation";
import { GARMENT_TYPES } from "@/lib/garments";
import Customizer from "./Customizer";

export default function Studio() {
  const params = useSearchParams();
  const garment =
    GARMENT_TYPES.find((item) => item.id === params.get("garment"))?.id ??
    "lineJacket";
  return <Customizer key={garment} initialGarment={garment} />;
}
