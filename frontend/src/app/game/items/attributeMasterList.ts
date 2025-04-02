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
  
    // smiley
    i002: {
      max_health_amp: [5,1],
      ad_amp: [0,1],
      range_amp: [0,1],
      speed_amp: [0,1],
    },

    // sword
    i003: {
        max_health_amp: [0,1],
        ad_amp: [0,1.5],
        range_amp: [0,1],
        speed_amp: [0,1],
      },
    
    //heart
    i004: {
      max_health_amp: [0,1.5],
      ad_amp: [0,1],
      range_amp: [0,1],
      speed_amp: [0,1],
    },
  };