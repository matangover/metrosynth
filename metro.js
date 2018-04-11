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
        7, //LaSalle: 5:37
        8 //Charlevoix: 5:38
      ],
      directions: ["Honoré-Beaugrand", "Angrignon"]
    }
  },
  peak: [
    {start: "07:00", end: "09:00"},
    {start: "16:00", end: "18:00"}
  ]
};
