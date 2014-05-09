WORDCRAFT
==========

[WORDCRAFT website]

## WordCraft Team

| Name | Email |
|:-----|:------|
| Divya Anand | divya.gayathri@gmail.com |
| Sonali Sharma | sonali1718@gmail.com |
| Victor Starostenko | victor.starostenko@live.com |
| Ashley DeSouza | ashley.souza@live.com |
| Shreyas | seekshreyas@gmail.com |





## Relevant DataStructure & Ontology


#### Scene Object

```javascript
var newDefaultSceneObj = [{
        "body" : {
            "eyes" : "res/img/animals/sheep/sheep_part_eye_happy.svg",
            "skin" : "res/img/animals/sheep/sheep_skin.svg",
            "mouth" : "res/img/animals/sheep/sheep_part_mouth_happy.svg",
            "color" : "", //there will be a default color for every animal
            "size" : "normal", //"normal is default.
            "width" : 200,
            "height" : 255
        },
        "pos" : {
            "plane" : "sky",
            "plane_pos" : "center_front",
            "plane_matrix" : [0, 0]
        },
        "animation" : [{
                "duration" : "", //(none)
                "animation_part" : "eyes" //(eyes, mouth)
                "animation_params" : {
                    "start" : "0", //(1)
                    "end" : "2", //(1)
                    "mid" : "" //(-1)
                },
                "speed" : "normal", //(very_fast, fast, normal, slow, very slow)
                "scale" : "",
                "animation_type" : "rotate"
            }, {
                "duration" : "", //(none)
                "animation_params" : {
                    "start" : "0", //(-10 to 10)
                    "end" : "2", //(-10 to 10)
                    "mid" : "" // (-10 to 10)
                },
                "speed" : "normal", //(very_fast, fast, normal, slow, very slow)
                "scale" : "",
                "animation_type" : "translateX"
            }, {
                "duration" : "none", //(none)
                "animation_params" : {
                    "start" : "0", // (-10 to 10)
                    "end" : "0", // (-10 to 10)
                    "mid" : "5" // (-10 to 10)
                },
                "speed" : "normal", //(very_fast, fast, normal, slow, very slow)
                "scale" : "",
                "animation_type" : "translateY"
            }, {
                "duration" : "", //(none)
                "animation_params" : {
                    "revolve" : true
                },
                "speed" : "normal",
                "scale" : "",
                "animation_type" : "revolve"
            }

        ]
    }, {
        "body" : {
            "eyes" : "res/img/animals/cat/cat_part_eye_happy.svg",
            "skin" : "res/img/animals/cat/cat_skin.svg",
            "mouth" : "res/img/animals/cat/cat_part_mouth_happy.svg",
            "color" : "",
            "size" : "large",
            "width" : 200,
            "height" : 255
        },
        "pos" : {
            "plane" : "sky",
            "plane_pos" : "center_front",
            "plane_matrix" : [0, 0]
        },
        "animation" : [{
                "duration" : "",
                "animation_params" : {
                    "start" : "0",
                    "end" : "2",
                    "mid" : ""
                },
                "speed" : "normal",
                "scale" : "",
                "animation_type" : "rotate"
            }, {
                "duration" : "",
                "animation_params" : {
                    "start" : "0",
                    "end" : "2",
                    "mid" : ""
                },
                "speed" : "normal",
                "scale" : "",
                "animation_type" : "translateX"
            }
        ]
    }
];

```



---
[WORDCRAFT website]: http://www.getwordcraft.com/