$(document).ready(function() {
    
    const parametersurl = new URLSearchParams(window.location.search);
    const code = parametersurl.get('code');
    const redirect = "https://localhost/ssd2/uploadfile.html" 
    const clientsecret = "R_MKleQHcDHZscBn5uqNh59A";
    const projectscope = "https://www.googleapis.com/auth/drive";
    var access_token= "";
    var clientid = "983487737789-09lvkbctsbnmbidte99mfghumn2a0bpm.apps.googleusercontent.com"
    

    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {
            code:code,
            redirect_uri:redirect,
            client_secret:clientsecret,
            client_id:clientid,
            scope:projectscope,
            grant_type:"authorization_code"
            
        },
        dataType: "json",
        success : function (resultData) {

            localStorage.setItem("accessToken",resultData.access_token);
            localStorage.setItem("refreshToken",resultData.refreshToken);
            localStorage.setItem("expires_in",resultData.expires_in);
            window.history.pushState({},document.title,"/ssd2/"+"uploadfile.html");
        }
  });
 
    function queryandHashPath(url) {
        return url.split("?")[0].split("#")[0];
    }
    var Fileupload = function (file) {
        this.file = file;
    };
    //get type of the uploaded file
    Fileupload.prototype.getType = function () {
      localStorage.setItem("type",this.file.type);
      return this.file.type;  
    };
    //get size of the uploaded file
    Fileupload.prototype.getSize = function () {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    //get name of the uploaded file
    Fileupload.prototype.getName = function () {
        return this.file.name;
    };


    Fileupload.prototype.doUpload = function () {
        var that = this;
        var fdata = new FormData();
     
      
      fdata.append("file",this.file,this.getName());
      fdata.append("upload_file",true);
     
        $.ajax({
          type : 'POST',
          beforeSend : function (request) {
              request.setRequestHeader("Authorization","Bearer"+" "+ localStorage.getItem("accessToken"));
          },
          url: "https://www.googleapis.com/upload/drive/v2/files",
          data:{
              uploadType:"media"
          },
          xhr: function () {
            var ssdxhr = $.ajaxSettings.xhr();
            if(ssdxhr.upload){
                ssdxhr.upload.addEventListener('progress',that.progressHandling,false);    
            }  
            return ssdxhr;
          },
          success : function (data) {
            console.log(data);
          },
          error : function (data) {
              console.log(data);
          },
          async: true,
          data:fdata,
          cache:false,
          contentType:false,
          processData:false,
          timeout:60000
      });
    };

    Fileupload.prototype.progressHandling = function (evnt) {
       
        var ssdposition = evnt.loaded || evnt.ssdposition;
        var percentage = 0;
        var total = evnt.total;
        var progressid = "#progressbar";
        if(evnt.lenghtComputable){
            percentage = Math.ceil(ssdposition / total*100);
        }
        $(progressid+" .status").text(percentage + "%");
    };
    //listner for upload button
    $("#uploadbtn").on("click", function (e) {
       var upldfile = $("#files")[0].files[0];
       var upld = new Fileupload(upldfile);
       upld.doUpload(); 
    });


});