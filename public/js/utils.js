function prettyfy(inputText) {
      var expression, matches, replaceText, replacePattern0, replacePattern1, replacePattern2, replacePattern3;
      
      /**~Equivalent to HTMLentities **/
      replacedText = inputText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      
      //URLs starting with ftp://
      replacePattern1 = /(\bftp:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

      
      //URLs starting with http://, https://.
      searchPattern = /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      
      matches = inputText.match(searchPattern);
      if(matches) {
        matches = $.unique(matches);
        matches.forEach(function(entry) {
          expression = new RegExp(XRegExp.escape(entry), "g");
          if (entry.match(/\.(gif|png|jpg|jpeg)$/)) {
            // Turn images into previews
            replacedText = inputText.replace(expression, '<a href="' + entry + '" target="_blank"><img class="image_preview" src="' + entry + '" alt="Image preview"/></a>');
          } else if (id_matchs = entry.match(/(?:youtube\.com\/watch\?)((?:[\w\d\-\_\=]+&amp;(?:amp;)?)*v(?:&lt;[A-Z]+&gt;)?=([0-9a-zA-Z\-\_]+))/i)) {
            video_id = id_matchs[2];
            videoString = '<iframe id="ytplayer" type="text/html" width="640" height="390" src="http://www.youtube.com/embed/' + video_id + '?autoplay=0&origin=http://osomtalk.com" frameborder="0"/>';
              
            //Turn Youtubes into Embededs
            replacedText = inputText.replace(expression, videoString);
          }/* else {
            replacedText = inputText.replace(expression, '<a href="' + entry + '" target="_blank">' + entry + '</a>');
          }*/
        });
      }
      
      //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

      //Change email addresses to mailto:: links.
      replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

      return replacedText
    }

    /** Not Used **/
    function htmlEntities(inputText) {
      return inputText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }