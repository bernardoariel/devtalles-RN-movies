export interface FormaPago {
    CodForPago: string;
    TipoForma: string;
    FormaPago: string;
    CodRef: string;
  }
  
  export enum CodRef {
    Ban = 'BAN',
    CLI = 'CLI',
    Caj = 'CAJ',
    Cus = 'CUS',
  }
  
  export enum TipoForma {
    C = 'C',
    F = 'F',
    M = 'M',
    O = 'O',
    T = 'T',
    X = 'X',
  }
  