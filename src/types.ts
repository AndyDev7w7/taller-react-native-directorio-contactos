export type Contact = {
  id: string;
  nombre: string;
  telefono: string;
  ciudad: string;
};

export type RootStackParamList = {
  Lista: undefined;
  Detalle: { contactId: string };
  Nuevo: undefined;
};
