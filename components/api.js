const colorMindUrl = 'http://colormind.io/api/';

var fullColorList = [];

async function getColours(a, b, c, d, e)
{
    //initial variables
    var colorList;
    var colorHex = [];
    let colorCode = "";

    //reset the colour list on reload
    fullColorList.length = 0;

    if(!isNaN(a) || a == undefined)
    {
        a = "N";
    }

    if(!isNaN(b)|| b == undefined)
    {
        b = "N";
    }

    if(!isNaN(c) || c == undefined)
    {
        c = "N";
    }

    if(!isNaN(d) || d == undefined)
    {
        d = "N";
    }

    if(!isNaN(e) || e == undefined)
    {
        e = "N";
    }

    //fetch colors from ColorMind
    await fetch(colorMindUrl, 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
        {
            model: 'default',
            input: [a, b, c, d, e]
        })
})
    .then(response => response.json())
    .then(data => 
    {
        colorList = data.result;

    })
    .catch(error => {
        console.error('Error fetching color scheme:', error);
    });

    //convert rgb to hex
    for(let i = 0; i < colorList.length; i++)
    {
        let colorSet = colorList[i];
        
        colorHex.push(rgbToHex(colorSet[0], colorSet[1], colorSet[2]));

        colorCode = colorHex[i];
        await getCodes(colorCode, colorSet, i);
    }

    return fullColorList;
}

//below two functions taken from: https://www.sqlpey.com/javascript/javascript-rgb-hex-conversion/#rgb-to-hex-conversion
function componentToHex(c)
{
    var hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b)
{
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//get all representations of colors for each hex code
async function getCodes(c, set, i)
{
    const theColorApiUrl = `https://www.thecolorapi.com/id?hex=${c}&format=json`;
    const colorSet = set;
    const id = i;
    //array for the single set of color values
    let colorEntry = []; 

    //fetch the api data from The Color Api and convert to JSON
    await fetch(theColorApiUrl, colorSet)
        .then(response => response.json())
        .then(data => 
        {
            //format strings for better display
            let adjustedRgb = data.rgb.value.slice(4, (data.rgb.value.length - 1));
            let adjustedCmyk = data.cmyk.value.slice(5, (data.cmyk.value.length - 1));
            let adjustedHsl = data.hsl.value.slice(4, (data.hsl.value.length - 1));           

            //push the values to the colorEntry array, naming each one
            colorEntry.push({colorId: id, colorName: data.name.value, rgbInt: colorSet, hex: data.hex.value, rgb: adjustedRgb, cmyk: adjustedCmyk, hsl: adjustedHsl});

            //push the full entry onto the full colour list array
            fullColorList.push(colorEntry);
        })
}

//toggle a lock button
function lockColor()
{
    console.log("button locked");
}

function copyToClipboard()
{
    return false;
}

export default
{
    getColours,
    lockColor,
    copyToClipboard
};