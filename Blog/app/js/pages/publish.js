class Publish {
  render() {
    var simplemde = new SimpleMDE({
      element: document.getElementById("postContent"),
      spellChecker: false
    });

    try {
      var contractWithAbi = web3.eth.contract(JSON.parse(abi));
      var blog = contractWithAbi.at(address);
      blog.numberOfPosts.call()
    } catch(err) {
      console.log(err);
      hideLoadingAlert();
      showWrongContractAlert();
    }

    hideLoadingAlert();
    showPublishPostForm();

    var submitPostButton = document.querySelector("#submitButton")

    submitPostButton.addEventListener("click", function(){
      var title = document.querySelector("#postTitle").value;
      var content = simplemde.value();

      var post = {
        title: title,
        content: content
      };

      var postAsJSON = JSON.stringify(post);

      ipfsClient.add(Buffer.from(postAsJSON), function(error, result){
        if(error) {
          alert('Error');
        }

        var hash = result[0].hash;

        var publicKey = "0x58a0a8c771c910ac6b717e401abfc7b50f34c699"
        blog.publishPost(hash, { from: publicKey, gas: 1000000 }, function(error){
          if(!error){
            window.location = '/?address=' + address;
          }
        });
      });
    });

    var previewButton = document.querySelector("#previewButton")

    previewButton.addEventListener("click", function(){
      var title = document.querySelector("#postTitle").value;
      var content = simplemde.value();

      vex.open({
        unsafeContent: '<h1>' + title + '</h1>' + converter.makeHtml(content),
        contentClassName: 'modalPost'
      })
    });
  }
}
