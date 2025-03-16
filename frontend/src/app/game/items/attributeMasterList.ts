type Attributes = {
    max_health_amp: number[];
    ad_amp: number[];
    range_amp: number[];
    speed_amp: number[];
  };
  
  export const attributeMasterList: Record<string, Attributes> = {
    // Dummy
    i000: {
      max_health_amp: [0,1],
      ad_amp: [0,1],
      range_amp: [0,1],
      speed_amp: [0,1],
    },
  
    // butterfly
    i001: {
      max_health_amp: [0,1],
      ad_amp: [0,1],
      range_amp: [1,1],
      speed_amp: [0,1],
    },
  
    // caterpillar
    i002: {
      max_health_amp: [2,1],
      ad_amp: [0,1],
      range_amp: [0,1],
      speed_amp: [0,1],
    },

    // gun
    i003: {
        max_health_amp: [0,1],
        ad_amp: [1,1],
        range_amp: [0,1],
        speed_amp: [0,1],
      },
  };