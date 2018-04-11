var metro = {
  lines: {
    green: {
      name: "green",
      frequencies: {
        weekdays: {
          peak: 4, // 3-4
          nonpeak: 7 // 4-10
        },
        weekend: 9 // 6-12
      },
      hours: [
        {
          weekdays: {first: "05:30", last: "00:35"},
          saturday: {first: "05:30", last: "01:05"},
          sunday: {first: "05:30", last: "00:35"}
        },
        {
          weekdays: {first: "05:30", last: "00:38"},
          saturday: {first: "05:30", last: "01:08"},
          sunday: {first: "05:30", last: "00:38"}
        }
      ],
      times: [
        0, // Angrignon: 5:30
        1, //Monk: 5:31
        2, //Jolicoeur: 5:32
        4, //Verdun: 5:34
        5, //De L'Église: 5:35
        7, //LaSalle: 5:37
        8, //Charlevoix: 5:38
        10, // Lionel Groulx: 5:40
        12, // Atwater: 5:42
        13, // Guy Concordia: 5:43
        15, // Peel: 5:45
        16, // McGill: 5:46
        17, // Place des Arts: 5:47
        18, // Saint Laurent: 5:48
        19, // Berri UQAM: 5:49
        20, // Beaudry: 5:50
        21, // Papineau: 5:51
        23, // Frontenac: 5:53
        24, // Préfontaine: 5:54
        26, // Joliette: 5:56
        27, // Pie-IX: 5:57
        28, // Viau: 5:58
        30, // Assomption: 6:00
        31, // Cadillac: 6:01
        32, // Langelier: 6:02
        34, // Radisson: 6:04
        35 // Honoré-Beaugrand: 6:05 -- assumed
      ],
      directions: ["Honoré-Beaugrand", "Angrignon"]
    }
  },
  peak: [
    {start: "07:00", end: "09:00"},
    {start: "16:00", end: "18:00"}
  ]
};
