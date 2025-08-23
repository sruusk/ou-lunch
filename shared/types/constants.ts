export const CAMPUSES = {
  OULU: {
    LINNANMAA: {
      city: 'Oulu',
      campus: 'Linnanmaa',
    },
  },
  TAMPERE: {
    HERVANTA: {
      city: 'Tampere',
      campus: 'Hervanta',
    },
  },
  PORI: {
    SAMK: {
      city: 'Pori',
      campus: 'SAMK',
    },
  },
};

export interface Campus {
  [key: string]: {
    city: string;
    campus: string;
  };
}
