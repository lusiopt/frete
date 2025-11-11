"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Package } from "lucide-react";
import type { QuotationRequest, QuotationResponse, Box, Item } from "@/types/shipsmart";
import { COUNTRIES, ENVELOPE_TYPES, getDivisionsByCountry } from "@/lib/address-data";

interface QuotationFormProps {
  onSubmit: (data: QuotationResponse) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function QuotationForm({ onSubmit, isLoading, setIsLoading }: QuotationFormProps) {
  const [formData, setFormData] = useState<Partial<QuotationRequest>>({
    object: "doc",
    type: "simple",
    tax: "sender",
    insurance: false,
    currency_quote: "USD",
    currency_payment: "BRL",
    measurement: "metric",
    residential_delivery: false,
    non_stackable: false,
    address_sender: {
      country_code: "BR",
      state_code: "CE",
    },
    address_receiver: {
      country_code: "PT",
      state_code: "11",
    },
    boxes: [
      {
        name: "Caixa 1",
        height: 10,
        width: 15,
        depth: 20,
        weight: 2.5,
        price: 10,
      },
    ],
    items: [
      {
        name: "Item 1",
        quantity: 1,
        unit_value: 50,
        weight: 2.5,
      },
    ],
  });

  const [boxes, setBoxes] = useState<Box[]>([
    {
      name: "Caixa 1",
      height: 10,
      width: 15,
      depth: 20,
      weight: 2.5,
      price: 10,
    },
  ]);

  const [items, setItems] = useState<Item[]>([
    {
      name: "Item 1",
      quantity: 1,
      unit_value: 50,
      weight: 2.5,
      box_id: 0,
      country_code: "BR",
      hscode: "",
    },
  ]);

  const [envelopeType, setEnvelopeType] = useState<string>("envelope_a4");

  // Atualiza dimensões da caixa quando tipo de envelope mudar
  useEffect(() => {
    if (formData.object === "doc" && boxes.length > 0) {
      const envelope = ENVELOPE_TYPES.find(e => e.value === envelopeType);
      if (envelope) {
        // Extrair dimensões do formato "22 x 31 cm"
        const dims = envelope.dimensions.match(/(\d+(?:\.\d+)?)/g);
        if (dims && dims.length >= 2) {
          setBoxes(prevBoxes => {
            const updatedBoxes = [...prevBoxes];
            updatedBoxes[0] = {
              ...updatedBoxes[0],
              name: envelope.label,
              height: 1, // Altura mínima aceita pela API
              width: parseFloat(dims[0]),
              depth: parseFloat(dims[1]),
              weight: 0.1, // Peso padrão para envelope (100g)
              price: 10, // Valor padrão da caixa
            };
            return updatedBoxes;
          });
        }
      }
    }
  }, [envelopeType, formData.object]);

  const addBox = () => {
    const newBox: Box = {
      name: `Caixa ${boxes.length + 1}`,
      height: 10,
      width: 15,
      depth: 20,
      weight: 2.5,
      price: 10,
    };
    setBoxes([...boxes, newBox]);
  };

  const removeBox = (index: number) => {
    if (boxes.length > 1) {
      setBoxes(boxes.filter((_, i) => i !== index));
    }
  };

  const updateBox = (index: number, field: keyof Box, value: string | number) => {
    const updatedBoxes = [...boxes];
    (updatedBoxes[index] as any)[field] = value;
    setBoxes(updatedBoxes);
  };

  const addItem = () => {
    const newItem: Item = {
      name: `Item ${items.length + 1}`,
      quantity: 1,
      unit_value: 50,
      weight: 1,
      box_id: 0,
      country_code: "BR",
      hscode: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const updatedItems = [...items];
    (updatedItems[index] as any)[field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // DEBUG: Log do estado boxes antes de construir o payload
      console.log("🔍 DEBUG - Estado boxes:", JSON.stringify(boxes, null, 2));
      console.log("🔍 DEBUG - boxes[0].price:", boxes[0]?.price);

      const payload: QuotationRequest = {
        ...formData,
        boxes,
        items: (formData.type === "advanced" || formData.type === "items") && formData.object !== "doc" ? items : undefined,
      } as QuotationRequest;

      // DEBUG: Log do payload completo
      console.log("📤 DEBUG - Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: QuotationResponse = await response.json();

      // DEBUG: Log da resposta completa
      console.log("📥 DEBUG - Resposta completa:", JSON.stringify(data, null, 2));

      if (data.status === "success") {
        onSubmit(data);
      } else {
        console.error("❌ DEBUG - Erro retornado pela API:");
        console.error("Status:", data.status);
        console.error("Message:", data.message);
        console.error("Data completo:", JSON.stringify(data, null, 2));
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ DEBUG - Exceção capturada:", error);
      console.error("Tipo do erro:", typeof error);
      console.error("Erro stringified:", JSON.stringify(error, null, 2));
      alert("Erro ao enviar cotação");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Nova Cotação</CardTitle>
          <CardDescription>
            Preencha os dados para simular o frete
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configurações Básicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Configurações</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="object">Tipo de Objeto</Label>
                <Select
                  value={formData.object}
                  onValueChange={(value) =>
                    setFormData({ ...formData, object: value as "doc" | "not_doc" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_doc">Não Documento</SelectItem>
                    <SelectItem value="doc">Documento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Cotação</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      type: value as "simple" | "advanced" | "items",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simples</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                    <SelectItem value="items">Por Itens</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax">Quem Paga</Label>
                <Select
                  value={formData.tax}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tax: value as "sender" | "receiver" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sender">Remetente</SelectItem>
                    <SelectItem value="receiver">Destinatário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurement">Medidas</Label>
                <Select
                  value={formData.measurement}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      measurement: value as "metric" | "imperial",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Métrico (cm/kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (in/lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="insurance"
                checked={formData.insurance}
                onChange={(e) =>
                  setFormData({ ...formData, insurance: e.target.checked })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="insurance" className="cursor-pointer">
                Incluir Seguro
              </Label>
            </div>
          </div>

          {/* Campo condicional para tipo de envelope quando for documento */}
          {formData.object === "doc" && (
            <div className="space-y-2">
              <Label htmlFor="envelope">Tipo de Envelope</Label>
              <Select
                value={envelopeType}
                onValueChange={setEnvelopeType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENVELOPE_TYPES.map((env) => (
                    <SelectItem key={env.value} value={env.value}>
                      {env.label} ({env.dimensions})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Endereços */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Endereços</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>País Origem</Label>
                <Select
                  value={formData.address_sender?.country_code || "US"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      address_sender: {
                        ...formData.address_sender,
                        country_code: value,
                        state_code: "", // Reset state when country changes
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(() => {
                const divisions = getDivisionsByCountry(formData.address_sender?.country_code || "");
                if (!divisions) return null;

                return (
                  <div className="space-y-2">
                    <Label>{divisions.label} Origem</Label>
                    <Select
                      value={formData.address_sender?.state_code || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          address_sender: {
                            ...formData.address_sender,
                            state_code: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione o ${divisions.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.divisions.map((division) => (
                          <SelectItem key={division.code} value={division.code}>
                            {division.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })()}

              <div className="space-y-2">
                <Label>País Destino</Label>
                <Select
                  value={formData.address_receiver?.country_code || "BR"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      address_receiver: {
                        ...formData.address_receiver,
                        country_code: value,
                        state_code: "", // Reset state when country changes
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(() => {
                const divisions = getDivisionsByCountry(formData.address_receiver?.country_code || "");
                if (!divisions) return null;

                return (
                  <div className="space-y-2">
                    <Label>{divisions.label} Destino</Label>
                    <Select
                      value={formData.address_receiver?.state_code || ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          address_receiver: {
                            ...formData.address_receiver,
                            state_code: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Selecione o ${divisions.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {divisions.divisions.map((division) => (
                          <SelectItem key={division.code} value={division.code}>
                            {division.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Caixas */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Caixas</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBox}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Caixa
              </Button>
            </div>

            {boxes.map((box, index) => (
              <Card key={index} className="p-4 relative">
                {boxes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeBox(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label>Nome da Caixa</Label>
                    <Input
                      value={box.name}
                      onChange={(e) => updateBox(index, "name", e.target.value)}
                      placeholder="Ex: Caixa Grande"
                    />
                  </div>

                  <div>
                    <Label>Altura (cm)</Label>
                    <Input
                      type="number"
                      value={box.height}
                      onChange={(e) =>
                        updateBox(index, "height", parseFloat(e.target.value))
                      }
                      min="1"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <Label>Largura (cm)</Label>
                    <Input
                      type="number"
                      value={box.width}
                      onChange={(e) =>
                        updateBox(index, "width", parseFloat(e.target.value))
                      }
                      min="1"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <Label>Profundidade (cm)</Label>
                    <Input
                      type="number"
                      value={box.depth}
                      onChange={(e) =>
                        updateBox(index, "depth", parseFloat(e.target.value))
                      }
                      min="1"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <Label>Peso (kg)</Label>
                    <Input
                      type="number"
                      value={box.weight}
                      onChange={(e) =>
                        updateBox(index, "weight", parseFloat(e.target.value))
                      }
                      min="0.1"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <Label>Valor da Caixa ($)</Label>
                    <Input
                      type="number"
                      value={box.price || 10}
                      onChange={(e) =>
                        updateBox(index, "price", Math.max(0.01, parseFloat(e.target.value) || 10))
                      }
                      min="0.01"
                      step="0.01"
                      placeholder="10.00"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Itens (se tipo não for simples e não for documento) */}
          {formData.type !== "simple" && formData.object !== "doc" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Itens</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              {items.map((item, index) => (
                <Card key={index} className="p-4 relative">
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Nome do Item</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(index, "name", e.target.value)}
                        placeholder="Ex: Produto Eletrônico"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Caixa</Label>
                      <Select
                        value={item.box_id?.toString() || "0"}
                        onValueChange={(value) =>
                          updateItem(index, "box_id", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a caixa" />
                        </SelectTrigger>
                        <SelectContent>
                          {boxes.map((box, boxIndex) => (
                            <SelectItem key={boxIndex} value={boxIndex.toString()}>
                              {box.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>País de Origem</Label>
                      <Select
                        value={item.country_code || "BR"}
                        onValueChange={(value) =>
                          updateItem(index, "country_code", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Código HS (NCM)</Label>
                      <Input
                        value={item.hscode || ""}
                        onChange={(e) => updateItem(index, "hscode", e.target.value)}
                        placeholder="Ex: 8517.62.55"
                        maxLength={10}
                      />
                    </div>

                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseInt(e.target.value))
                        }
                        min="1"
                      />
                    </div>

                    <div>
                      <Label>Valor Unitário ($)</Label>
                      <Input
                        type="number"
                        value={item.unit_value}
                        onChange={(e) =>
                          updateItem(index, "unit_value", parseFloat(e.target.value))
                        }
                        min="0.01"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <Label>Peso (kg)</Label>
                      <Input
                        type="number"
                        value={item.weight}
                        onChange={(e) =>
                          updateItem(index, "weight", parseFloat(e.target.value))
                        }
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Botão Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Consultando...
              </>
            ) : (
              <>
                <Package className="h-4 w-4 mr-2" />
                Simular Frete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
