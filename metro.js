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
    },
    yellow: {
      name: "yellow",
      frequencies: {
        weekdays: {
          peak: 4, // 3-5
          nonpeak: 8 // 5-10
        },
        weekend: 8 // 5-10
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
        0, // Longueuil
        3, // Jean Drapeau
        15 // Berri UQAM
      ]
    },
    blue: {
      name: "blue",
      frequencies: {
        weekdays: {
          peak: 4, // 3-5
          nonpeak: 8 // 5-10
        },
        weekend: 8 // 5-10
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
        0, // Snowdon
        1,
        2,
        4,
        5,
        6,
        8,
        9,
        40,
        42,
        43,
        45 // Saint Michel
      ]
    },
    orange: {
      name: "orange",
      frequencies: {
        weekdays: {
          peak: 4, // 3-5
          nonpeak: 8 // 5-10
        },
        weekend: 8 // 5-10
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
      times: [ // TODO: it's reversed from the actual graphical direction
        0,  //5:29 AM Montmorency
        1,//5:31 AMDe la Concorde Station
        3,//5:33 AMStation Cartier
        5,//5:35 AMHenri-Bourassa
        6,//5:36 AMSauvé
        9,//5:39 AMCrémazie
        10,//5:40 AMJarry
        12,//5:42 AMJean-Talon
        13,//5:43 AMBeaubien
        14,//5:44 AMRosemont
        16,//5:46 AMLaurier
        17,//5:47 AMMont-Royal
        18,//5:48 AMSherbrooke
        20,//5:50 AMBerri-UQAM
        21,//5:51 AMChamp-de-Mars
        22,//5:52 AMPlace-d'Armes
        23,//5:53 AMSquare-Victoria–OACI
        24,//5:54 AMBonaventure
        25,//5:55 AMLucien L'Allier
        27,//5:57 AMGeorges-Vanier
        28,//5:58 AMLionel Groulx
        29,//5:59 AMPlace Saint-Henri
        31,//6:01 AMVendôme
        34,//6:04 AMVilla-Maria
        35,//6:05 AMSnowdon
        36,//6:06 AMCote-Ste-Catherine
        37,//6:07 AMPlamondon
        39,//6:09 AMNamur
        40,//6:10 AMSavane
        42,//6:12 AMDu Collège
        44//6:14 AM
      ]
    }
  },
  peak: [
    {start: "07:00", end: "09:00"},
    {start: "16:00", end: "18:00"}
  ]
};
