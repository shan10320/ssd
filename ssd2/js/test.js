$(document).ready(function(){
    

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirect_uri = "https://localhost/ssd2/uploadfile.html" 
    const client_secret = "R_MKleQHcDHZscBn5uqNh59A"; 
    const scope = "https://www.googleapis.com/auth/drive";
    var access_token= "";
    var client_id = "983487737789-09lvkbctsbnmbidte99mfghumn2a0bpm.apps.googleusercontent.com"
    

    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {
            code:code,
            redirect_uri:redirect_uri,
            client_secret:client_secret,
            client_id:client_id,
            scope:scope,
            grant_type:"authorization_code"},
        dataType: "json",
        success: function(resultData) {
           
            
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           window.history.pushState({}, document.title, "/ssd2/" + "uploadfile.html");
           
           
           
           
        }
  });

    function squeryandhash(url) {
        return url.split("?")[0].split("#")[0];
    }   

    var FileUpload = function (file) {
        this.file = file;
    };
    
    FileUpload.prototype.getType = function() {
        localStorage.setItem("type",this.file.type);
        return this.file.type;
    };
    FileUpload.prototype.getSize = function() {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    FileUpload.prototype.getName = function() {
        return this.file.name;
    };
    FileUpload.prototype.doUpload = function () {
        var that = this;
        var fData = new FormData();
    
        // add assoc key values, this will be posts values
        fData.append("file", this.file, this.getName());
        fData.append("upload_file", true);
    
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data:{
                uploadType:"media"
            },
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', that.progressHandling, false);
                }
                return myXhr;
            },
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            },
            async: true,
            data: fData,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };
    
    FileUpload.prototype.progressHandling = function (evnt) {
        var percentage = 0;
        var pos = evnt.loaded || evnt.pos;
        var total = evnt.total;
        var progressid = "#progressbar";
        if (evnt.lengthComputable) {
            percentage = Math.ceil(pos / total * 100);
        }
        // update progressbars classes so it fits your code
        $(progressid + " .progress-bar").css("width", +percentage + "%");
        $(progressid + " .status").text(percentage + "%");
    };

    $("#uploadbtn").on("click", function (e) {
        var fileload = $("#files")[0].files[0];
        var upld = new FileUpload(fileload);
 
        upld.doUpload();
    });



    
});