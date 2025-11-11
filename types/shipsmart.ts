// ShipSmart API Types

export interface QuotationRequest {
  channel_code?: number;
  channel_identifier_number?: string;
  object: "doc" | "not_doc";
  type: "simple" | "advanced" | "items";
  tax: "sender" | "receiver";
  insurance: boolean;
  currency_quote: string;
  currency_payment: string;
  measurement: "metric" | "imperial";
  residential_delivery: boolean;
  non_stackable: boolean;
  address_sender: Address;
  address_receiver: Address;
  boxes: Box[];
  items?: Item[];
}

export interface Address {
  address_code?: number;
  country_code?: string;
  state_code?: string;
  state?: string;
  postal_code?: string;
  city?: string;
  street?: string;
  number?: string;
  district?: string;
  complement?: string;
  description?: string;
  name?: string;
  email?: string;
  phone?: string;
  phone_extension?: string;
  type?: "pf" | "pj";
  federal_tax_id?: string;
  state_tax_id?: string;
  foreign?: boolean;
}

export interface Box {
  box_code?: number;
  box_identifier?: string;
  name: string;
  height: number;
  width: number;
  depth: number;
  weight?: number;
  price?: number;
}

export interface Item {
  box_id?: number;
  sku?: string;
  ean?: string;
  name: string;
  description?: string;
  country_code?: string;
  hscode?: string;
  weight: number;
  quantity: number;
  unit_value: number;
}

export interface QuotationResponse {
  status: "success" | "warning" | "error";
  message: string;
  data: {
    quotation: string;
    finished: boolean;
    date: string;
    description?: string;
    channel?: string;
    channel_identifier_number?: string;
    object: string;
    type: string;
    tax: string;
    insurance: boolean;
    currency_quote: string;
    currency_payment: string;
    carriers: Carrier[];
  };
}

export interface Carrier {
  code: number;
  name: string;
  url_image: string;
  valid_until: string;
  transit_days: number;
  weight_details: {
    type: "real" | "cubed";
    weight: string;
  };
  freight: string;
  freight_final: string;
  insurance: string;
  insurance_final: string;
  tax: string;
  tax_final: string;
  currency_quote_price: string;
  currency_quote_amount: string;
  currency_payment_amount: string;
}
