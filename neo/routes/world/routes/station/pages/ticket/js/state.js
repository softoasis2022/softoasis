export const State = {
  data: {
    worldId: "",
    worldName: "",
    stationId: "",
    unitBase: 0,
    unitFee: 0,
    qty: 1,
    stations: [],
  },

  resetAll() {
    this.data.worldId = "";
    this.data.worldName = "";
    this.data.stationId = "";
    this.data.unitBase = 0;
    this.data.unitFee = 0;
    this.data.qty = 1;
    this.data.stations = [];
  },

  resetStationSelection() {
    this.data.stationId = "";
    this.data.unitBase = 0;
    this.data.unitFee = 0;
  },
};
