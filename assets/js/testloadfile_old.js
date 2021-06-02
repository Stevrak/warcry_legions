<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>

<head>
  <script>
    window.onload = function() {
      var zip = new JSZip();

      function loadImage(url) {
        var request = new XMLHttpRequest();
        request.open("GET", url);
        request.responseType = "blob";
        request.onload = function() {
          console.log(this.response);
          var response = this.response;
          var filename = "image." + response.type.split("/")[1];
          zip.file(filename, response);
          zip.file(filename)
            .async("base64")
            .then(function(content) {
                console.log(content);
                var img = new Image;
                img.onload = function() {
                  document.body.appendChild(this)
                }
                img.src = "data:" + response.type + ";base64," + content;
              },
              function(e) {
                console.log("Error reading "
                            + file.name + " : "
                            + e.message);
              });

        }
        request.send()
      }

      loadImage("https://placeholdit.imgix.net/~text?txtsize=33&txt=350%C3%97150&w=350&h=150")
    }
  </script>
</head>

<body>
</body>
