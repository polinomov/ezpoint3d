
//const myPics = document.getElementById('myPics');
//const context = myPics.getContext('2d');

var htmlCanvas;
var context;
class GlobVars {
    mouseX = 0;
    mouseY = 0;
}
var gv = new GlobVars();

function callWasm1() {
    console.log("CallWasm");
    Module['canvas'] = document.getElementById('myPics');
    const result = Module.ccall('CallCFunc', 'number');
}

function Blah() {
    console.log("Hello TestMe5\n");
    //context.fillStyle = "red";
    //context.fillRect(100, 100, 100, 100);
    //callWasm1();
    //toggleFullScreen();
}

function OnDraw() {
}

function OnMouseMove(e) {
    
    gv.mouseX = e.offsetX;
    gv.mouseY = e.offsetY;
    OnDraw();
}

function OnFileSelected(input) {
    console.log("---fileSelected-- " + input.files[0].name);
    //document.getElementById('GFG').innerHTML='File Selected'
    var file = input.files[0];
    if (!file) {
        console.log("NO FILE");
        return;
    }
    console.log("YES FILE size=" + input.files[0].size);
    var fz = input.files[0].size;
    var reader = new FileReader();
    reader.onload = function (e) {
        // binary data
       
       console.log("-reader-onload-");
       var data = reader.result;
       var array = new Uint8Array(data);
       var res_ptr = Module._malloc(fz);
       Module.HEAPU8.set(array, res_ptr);
       file_cb = Module.cwrap('FileBinData', 'number', ['arrayPointer', 'number']);
       file_cb(res_ptr, fz);
       Module._free(res_ptr);
        // console.log("done  reading");
    };
    reader.onloadend = function (e) {
       console.log("load done");
    }

    reader.onerror = function (e) {
        // error occurred
        console.log('Error : ' + e.type);
    };
   // document.getElementById('GFG1').innerHTML='-JSStart'
    reader.readAsArrayBuffer(input.files[0]);  
   // document.getElementById('GFG1').innerHTML='-JSDone'
}

function OnFileOpen() {
    document.getElementById('attachment').click();
}


function resizeCanvas() {
    // console.log("Resize w=" + window.innerWidth + " h=" + window.innerHeight);
    resize_cb = Module.cwrap('CallCFunc', 'number', ['number','number']);
    resize_cb(window.innerWidth, window.innerHeight);
}

function OnLoaded() {  
    // init canvas
    htmlCanvas = document.getElementById('myPics');
    context = htmlCanvas.getContext('2d');
    resizeCanvas();
 }

function OnStart()
{
    console.log("-OnStart-\n");
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
}

//OnStart();