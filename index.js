  
// document.getElementById('files').addEventListener('change', handleFileSelect, false);



const webcamElement = document.getElementById('webcam');
const classifier = knnClassifier.create();
let net;



// //Select select box
// var navigationSelect = document.getElementById("files");

// //Navigate to URL when select box is changed
// var navigateToValue = function() {
//   window.location = this.value;
// }

// //Send analytics data
// var sendAnalytics = function() {
//   //Placeholder
// }

// navigationSelect.addEventListener('change',  handleFileSelect, false);
// navigationSelect.addEventListener('change',  sendAnalytics);




async function app() {
    console.log('Loading mobilenet..');
  
    // Load the model.
    net = await mobilenet.load();
    console.log('Sucessfully loaded model');
  
    await setupWebcam();
  
    // Reads an image from the webcam and associates it with a specific class
    // index.
    const addExample = classId => {
      
      // Get the intermediate activation of MobileNet 'conv_preds' and pass that
      // to the KNN classifier.
      const activation = net.infer(webcamElement, 'conv_preds');

      // context.drawImage(webcamElement, 0, 0, 100, 75);
      
      // Pass the intermediate activation to the classifier.
      classifier.addExample(activation, classId);
    };
    // When clicking a button, add an example for that class.
    // document.getElementById('class-a').addEventListener('click', () => addExample(0));
    // document.getElementById('class-b').addEventListener('click', () => addExample(1));
    // document.getElementById('class-c').addEventListener('click', () => addExample(2));
  
    document.getElementById("class-a").addEventListener("click", () => {
      addExample(0);
      let context_a = document.getElementById('canvas-a').getContext('2d')
      context_a.drawImage(webcamElement, 0, 0, 100, 75);
      // document.getElementById("box1").checked = false;
  });
      document.getElementById("class-b").addEventListener("click", () => {
        addExample(1);
        let context_b = document.getElementById('canvas-b').getContext('2d')
        context_b.drawImage(webcamElement, 0, 0, 100, 75);
        // document.getElementById("box1").checked = false;
    });

    document.getElementById("class-c").addEventListener("click", () => {
      addExample(2);
      let context_c = document.getElementById('canvas-c').getContext('2d')
      context_c.drawImage(webcamElement, 0, 0, 100, 75);
      // document.getElementById("box1").checked = false;
    });

    while (true) {
      if (classifier.getNumClasses() > 0) {
        // Get the activation from mobilenet from the webcam.
        const activation = net.infer(webcamElement, 'conv_preds');
        // Get the most likely class and confidences from the classifier module.
        const result = await classifier.predictClass(activation);
  
        const classes = ['A', 'B', 'C'];

        document.getElementById('console').innerText = `
          prediction: ${classes[result.classIndex]}\n
          probability: ${result.confidences[result.classIndex]}
        `;
        // console.log(result)
      }
  
      await tf.nextFrame();
    }
  }




async function setupWebcam() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
          stream => {
            webcamElement.srcObject = stream;
            webcamElement.addEventListener('loadeddata',  () => resolve(), false);
          },
          error => reject());
      } else {
        reject();
      }

    });
  }




// function handleFileSelect(evt) {
//   var files = evt.target.files; // FileList object

//   // Loop through the FileList and render image files as thumbnails.
//   for (var i = 0, f; f = files[i]; i++) {

//     // Only process image files.
//     if (!f.type.match('image.*')) {
//       continue;
//     }

//     var reader = new FileReader();

//     // Closure to capture the file information.
//     reader.onload = (function(theFile) {
//       return function(e) {
//         // Render thumbnail.
//         var span = document.createElement('span');
//         span.innerHTML = ['<img class="thumb" src="', e.target.result,
//                           '" title="', escape(theFile.name), '"/>'].join('');
//         document.getElementById('list').insertBefore(span, null);
//       };
//     })(f);

//     // Read in the image file as a data URL.
//     reader.readAsDataURL(f);
//   }
// }

app();

