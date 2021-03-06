var calls = [];
var colorDictionary = {
  "Silver": "#c0c0c0","Gold": "#ffd700","Black": "#000000","Blue": "#0000ff","Brown": "#A52A2A",
  "Clear": "rgba(255,255,255,0)","Green": "#00ff00","Grey": "#808080","Opal": "#a9c6c2","Orange": "#FFA500",
  "Pink": "#FFC0CB","Purple": "#800080","Rainbow": "linear-gradient(to right, orange , yellow, green, cyan, blue, violet)",
  "Red": "#FF0000","Tan": "#D2B48C","Teal": "#008080","Turquoise": "#40E0D0","White": "#fff","Yellow": "#ffff00",
  "Multi": "repeating-linear-gradient(red, yellow 10%, green 20%)","Copper": "#b87333","Rose Gold": "#b76e79",
  "Antique Gold": "#D4AF37", "Gunmetal": "#2c3539", "Crystal AB": "rgba(255,255,255,0)"};
var colors = [];
var functiontype = [];
var gotTax;
var loginModal = true;
var material = [];
var session_no;
var shoppingCart = {};
var UpdatedShoppingCart = {};

//3949422, 34719146, 34719128
/////////////////////////////////////////
// create new customer //
/////////////////////////////////////////

function createCustomer() {
  if ($("#create-contactname").valid() && $("#create-email").valid() && $("#create-phone").valid() && $("#create-address").valid() && $("#create-city").valid() && $("#create-state").valid() && $("#create-zipcode").valid()) {
    var createcompanyname = $("#create-contactname").val();
    var createcontactname = $("#create-contactname").val();
    var createaddress1 = "";
    var createaddress2 = "";
    var createaddress3 = "";
    var createcity = $("#create-city").val();
    var createstate = $("#create-state").val();
    var createzipcode = $("#create-zipcode").val();
    // var createcountry = $("#create-country").val();
    var createemail = $("#create-email").val();
    var createphone = $("#create-phone").val();
    var createfax = $("#create-fax").val();
    var addressArray = [];
    if ($("#create-address").val()) {
      addressArray = $("#create-address").val().match(/.{1,30}/g);
      if (addressArray[0] && typeof (addressArray[0]) === "string") {
        createaddress1 = addressArray[0];
      }
      if (addressArray[1] && typeof (addressArray[1]) === "string") {
        createaddress2 = addressArray[1];
      }
      if (addressArray[2] && typeof (addressArray[2]) === "string") {
        createaddress3 = addressArray[2];
      }
    }
    $.ajax({
      type: "GET",
      url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
      data: {
        request_id: "APINEWCUST",
        cust_name: createcompanyname,
        address1: createaddress1,
        address2: createaddress2,
        address3: createaddress3,
        city: createcity,
        state: createstate,
        zip: createzipcode,
        contact_name: createcontactname,
        phone: createphone,
        email: createemail,
        fax: createfax,
        country: "US",
        loc_no: "700"
      },
      success: function (response) {
        if (response.length <= 10) {
          alert("An error occured, please try again.");
          return false;
        } else {
          var newCustomerNumber = response;
          $("#newCustomer").hide();
          $("#newUser").show();
          document.getElementById("create-user-number").value = newCustomerNumber.trim();
          document.getElementById("create-user-email").value = createemail.trim();
          document.getElementById("create-user-contactname").value = createcompanyname.trim();
          return false;
        }
      }, 
      complete: function() {
        createUser();
      }
    });
  }
}



/////////////////////////////////////////
//////////// Create New User ////////////
/////////////////////////////////////////
function createUser() {
  var newUserName = $("#create-user-name").val();
  var userPassword = $("#create-user-password").val();
  var userPassword2 = $("#create-user-password-check").val();
  var userNumber = $("#create-user-number").val();
  var userEmail = $("#create-user-email").val();
  var userContactName = $("#create-user-contactname").val();

  if (userPassword != userPassword2) {
    alert("Your password and confirmation password do not match.");
    $("#create-user-password").focus();
    return false;
  }

  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICHECKUSER&session_no=2UD24M4BDN2D4RDAWABU9D254&username=" + newUserName.toUpperCase() + "", function (data) {
    if (data.length > 4) {
      alert("Pick a different username.");
    } else {
      $.ajax({
        type: "GET",
        url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
        data: {
          request_id: "APINEWUSER",
          new_username: newUserName,
          new_password: userPassword,
          cust_no: userNumber,
          contact_name: userContactName,
          email: userEmail,
          loc_no: "700"
        },
        success: function (response) {
          if (response === response.toUpperCase()) {
            alert("Your PrimaDIY account has been created! Happy Shopping!");
          //  $.get("dusername=" + newUserName + "&email=" + userEmail + "&password=" + userPassword + "&name=" + userContactName + "");
          } else {
            alert("User not created, try again.");
          }
          $('#login-form-username').val(newUserName);
          $('#login-form-password').val(UserPassword);
        },
        complete: function () {
          login();
        }
      });
    }
  });
}



////////////////////////////////////////
/// LOGIN INTO THE STORE AND VERIFY  ///
////////////////////////////////////////
function login() {
  
  if (localStorage.getItem('session_no') && typeof (localStorage.getItem('session_no')) === "string" && localStorage.getItem('session_no').length === 25 && localStorage.getItem('username') !== "Guest") {
    windowHash("products");
    redirect("store");
  }
  
  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    var username = $('#login-form-username').val();
    var password = $('#login-form-password').val();

    $.ajax({
      type: "GET",
      url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
      data: {
        request_id: "APICLOGIN",
        username: username,
        password: password,
        loc_no: "700"
      },
      success: function (response) {
        if (response.replace(/\s+/g, '').length === 25) {
          $.get("https://www.primadiy.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "", function (answer) {
            if (answer === "0") {
              $.get("https://www.primadiy.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "&sessid=" + response + "");
              session_no = response.replace(/\s+/g, '');
              localStorage.setItem('session_no', session_no);
            } else {
              localStorage.setItem('session_no', answer);
            }
            localStorage.setItem('username', username);
          }).done(function () {
            if( window.location.hash !== "checkout") {
              windowHash("products");
              redirect("store");
            }
          });
        } else {
          alert("Login credentials are incorrect, try again.");
        }
      }
    });
  });
}


$("#login-form-checkout").on("submit", function (e) {
  e.preventDefault();

  var username = $('#login-form-username-checkout').val();
  var password = $('#login-form-password-checkout').val();

  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APICLOGIN",
      username: username,
      password: password,
      loc_no: "700"
    },
    success: function (response) {
      if (response.replace(/\s+/g, '').length === 25) {
        $.get("https://www.primadiy.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "", function (answer) {
          if (answer === "0") {
            $.get("https://www.primadiy.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "&sessid=" + response + "");
            session_no = response.replace(/\s+/g, '');
            localStorage.setItem('session_no', session_no);
          } else {
            localStorage.setItem('session_no', answer);
          }
          localStorage.setItem('username', username);
        }).done(function () {
          $('#login-checkout-dismiss').click();
          addItemsBackLogin();
          cart();
        });
      } else {
        alert("Login credentials are incorrect, try again.");
      }
    }
  });
  return false;
});
function addItemsBackLogin(shoppingList) {
  $.each(shoppingList, function (key, value) { 
    $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTADD&session_no=" + session_no + "&stock_no=" + key + "&qty=" + value[0] + "", function(response) {
      if ( response.length !== 0 ) {
        $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTADD&session_no=" + session_no + "&stock_no=" + key + "&qty=" + value[0] + "");
      }
    });
  });
}


////////////////////////////////////////
/// LOGIN INTO THE STORE AND VERIFY  ///
////////////////////////////////////////
function guestLogin() 
{
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APICLOGIN",
      loc_no: 700
    },
    success: function (response) {
      localStorage.setItem('session_no', response.trim());
      localStorage.setItem('username', 'Guest');
    },
    complete: function (response) {
      windowHash("products");
      redirect("store");
    }
  });
}



/////////////////////////
// Search API Function //
/////////////////////////
function search() 
{
  $('#demo').jplist({
    command: 'empty'
   });
  var oldhash;
  
  if(event.keyCode == 13) {
    event.preventDefault();
    if ( window.location.hash != "#search" ) {
      oldhash = window.location.hash;
    }
    var searchTerm = $('#searchvalue').val().split(' ').join('+');
 
    $.ajax({
      type: "GET",
      url: "https://netlink.laurajanelle.com:444/nlhelpers/web-search-api/",
      data: {        
        data: searchTerm,
        location: "700"},
      success: function(response) {
             
        windowHash("products");
        $('.jplist-reset-btn').click();
        $('#display-products').empty();
        itemRender("display-products", response);
      }
    });
  }
}
////////////////////////////
// To Populate Shop Page  //
////////////////////////////
function fillShop()
{
 // $("span[data-number='all']").click();

  $('#color-panel, #panel-filter-material, #panel-filter-type, #display-products').empty();
  $('#demo').jplist({
    command: 'empty'
   });
//   $('#demo').jplist({
//   command: 'del',
//    commandData: {
//       $items: $('.hope')  //select your items using jQuery
//    }
//   });
   
  var params = "";
  if (localStorage.getItem('shopParams')) {
    params = localStorage.getItem('shopParams').split(",");
    $('#shopParamName').html(params[0]); 
    if (params[1] === "1") {
      return filterFunction(params[0]);
    } else if ( params[1] === "2") {
      return filterFunction2();
    } else if ( params[1] === "3") {
      return filterFunction3(params[0]);
    } else if ( params[1] === "4") {
      return filterFunction4();
    }
  } else {
    localStorage.setItem('shopParams', ['all', '4']);
    fillShop();
  }  

}


//////////////////////////
// Filter Function      //
//////////////////////////
function filterFunction(a) {
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhelpers/prima-api/programs.php?",
    data: {
      data: a,
      location: "700"
    },
    success: function (response) {
     // $('.jplist-reset-btn').click();
      itemRender("display-products", response);
    }
  });
}
function filterFunction2() {
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhelpers/prima-api/productlist/onsale/",
    success: function (response) {
    //  $('.jplist-reset-btn').click();
      itemRender("display-products", response);
    }
  });
}
function filterFunction3(a) {
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhelpers/prima-api/functions.php?",
    data: {
      data: a,
      location: "700"
    },
    success: function (response) {
    //  $('.jplist-reset-btn').click();
      itemRender("display-products", response);
    }
  });
}
function filterFunction4() {
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhelpers/prima-api/productlist/300/",
    success: function (response) {
    //  $('.jplist-reset-btn').click();
     // $('#display-products').empty();
      itemRender("display-products", response);
    }
  });
}



function itemRender(div, response) {
  lines = response;
 
  functiontype.length = 0;
  material.length = 0;
  colors.length = 0;
  if (lines.length <= 1) {
    document.getElementById(div).innerHTML += '<h1>There are no results</h1>';
  } else {
    var $demo = $('#demo');
    var items = [];
    $("#display-products").empty();
    
    Object.keys(lines).forEach(function(k){
      if ( banned.indexOf(lines[k].itemnum) != -1 ) { return; } 

      stringOfDetails = lines[k].itemnum;
      if ( notbanned.indexOf(lines[k].itemnum) != -1 ) {
        prod =  '<li class="hope ' + lines[k].color.replace(/ +/g, "") + " " + lines[k].func.replace(/ +/g, "") + " " + lines[k].material.replace(/ +/g, "") + '"><div class="product"><figure class="product-image-area"><a href="#product-details+' + stringOfDetails + '" title="' + lines[k].shortdescription + '" class="product-image"><span class="thumb-info"><img src="https://www.primaDIY.com/productimages/' + lines[k].itemnum + '-pk-md.jpg" alt="' + lines[k].shortdescription + '"></span</a>';
      } else {
        prod =  '<li class="hope ' + lines[k].color.replace(/ +/g, "") + " " + lines[k].func.replace(/ +/g, "") + " " + lines[k].material.replace(/ +/g, "") + '"><div class="product"><figure class="product-image-area"><a href="#product-details+' + stringOfDetails + '" title="' + lines[k].shortdescription + '" class="product-image"><span class="thumb-info"><img src="https://www.primaDIY.com/productimages/' + lines[k].itemnum + '-md.jpg" alt="' + lines[k].shortdescription + '"></span</a>';
      }
      if (lines[k].onsale === "Y" ) {
        prod += '<div class="product-label"><span class="discount">-$' + (parseFloat(lines[k].price) - parseFloat(lines[k].msrp)).toFixed(2) + '</span></div>';
      }
      prod += '</figure><div class="product-details-area"><h2 class="product-name"><a href="#product-details+' + stringOfDetails + '" title="' + lines[k].shortdescription + '">' + lines[k].shortdescription + '</a></h2><p class="title" style="display: none;">' + lines[k].shortdescription + '</p><div class="product-price-box">';
      prod += '<p class="desc" style="display: none;">' + lines[k].program + '</p><p class="themes" style="display: none;"><span class="' + lines[k].color.replace(/ +/g, "") + '">' + lines[k].color + '</span></p><p class="materials" style="display: none;"><span class="' + lines[k].material.replace(/ +/g, "") + '">' + lines[k].material + '</span></p>';
      
      if (lines[k].onsale === "Y" ) {
        prod += '<span class="old-price">$' + lines[k].price + '</span>';
      }
      
      prod += '<span class="product-price">$' + lines[k].msrp + '</span></div><div class="product-actions"><a href="#" class="addtocart" title="Add to Cart" onclick="stock_no=\'' + lines[k].itemnum + '\'; detailString=\'#detail-view+' + stringOfDetails + '\'; addItemDetailView(); cart(); showAlert(); return false;"><i class="fa fa-shopping-cart"></i><span>Add to Cart</span></a></div></div></div></li>';

      items.push($(prod));
     
      listOfAttributes(functiontype, lines[k].func );      
      listOfAttributes(material, lines[k].material);
      listOfAttributes(colors, lines[k].color);
    });
   
    $demo.jplist({
      itemsBox: '#display-products',
      itemPath: '.hope',
      panelPath: '.jplist-panel'
    });
    $demo.jplist({
      command: 'add',
      commandData: {
        $items: items
      }
    });
  }
  fillTypeField();
}


//////////////////////////
// Filter Function      //
//////////////////////////
function fillTypeField() 
{
  functiontype.forEach(function (element) {
    $('#panel-filter-type').append('<li><div class="checkbox-custom checkbox-themed"><input type="checkbox" onclick="$(\'#'+ element.replace(/ +/g, "") +'\').click();"><label for="checkboxExample2">'+ element + '</label></div></li>');
  });

  material.forEach(function (element) {
    $('#panel-filter-material').append('<li><div class="checkbox-custom checkbox-themed"><input type="checkbox"onclick="$(\'#'+ element.replace(/ +/g, "") +'\').click();"><label for="checkboxExample2">'+ element +'</label></div></li>');
  });
  
  colors.forEach(function (element) {
    $('#color-panel').append('<li id="'+ element.replace(/ +/g, "") + 1 +'"><a href="#"><span data-plugin-tooltip data-toggle="tooltip" data-placement="top" title="'+ element +'" style="background: '+ colorDictionary[element] +'" onclick="$(\'#'+ element.replace(/ +/g, "") +'\').click();"></span></a></li>');
  });
  $('span').tooltip({}); 
}

function listOfAttributes(attr, field)
{
  if ( attr.indexOf(field.trim()) == -1 ) {
    attr.push(field.trim());
  }
}

//////////////////////////////
// Get Detail View for Item //
//////////////////////////////
function detailView(callback, callback2) {
  jQuery("#productGalleryThumbs, .product-short-desc p, #detail-old-price").empty();
  jQuery("a.detailadd").remove();

  var picsGallery = "";
  //var picArray = ["", "-pk", "-rl"];
  var dets;
  var secondColumn;
  var detailString;
  var color;
  var type;
  var metal;
  var rate = true;
  //var secondImage;
  var hash = window.location.hash.split("+");
  var stock_no = hash[1];
  // var productRating = [];

  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhelpers/prima-api/detail-views.php?",
    data: {
      data: stock_no,
      location: 700
    },
    success: function (response) {
     
      Object.keys(response).forEach(function(k){
      /* Fill in the pictures for the product */
        if ( notbanned.indexOf(response[k].itemnum) != -1 ) {
          $("#product-zoom").attr({
            src: "https://www.primaDIY.com/productimages/" + response[k].itemnum + "-pk-lg.jpg",
            "data-zoom-image": "https://www.primaDIY.com/productimages/" + response[k].itemnum + "-pk-lg.jpg",
            alt: response[k].shortdescription
          });
        } else {
          $("#product-zoom").attr({
            src: "https://www.primaDIY.com/productimages/" + response[k].itemnum + "-lg.jpg",
            "data-zoom-image": "https://www.primaDIY.com/productimages/" + response[k].itemnum + "-lg.jpg",
            alt: response[k].shortdescription
          });
        }
        /*
        picArray.forEach(function (element) {
          picsGallery += '<div class="product-img-wrapper '+element+'"><a href="#" data-image="https://www.primaDIY.com/productimages/' + fields[0].trim() + element + '-lg.jpg" data-zoom-image="https://www.primaDIY.com/productimages/' + fields[0].trim() + element + '-lg.jpg" class="product-gallery-item"><img class="'+element+'" src="https://www.primaDIY.com/productimages/' + fields[0].trim() + element + '-sm.jpg" alt="'+ fields[1].trim() +'"></a></div>';
        });
        */
        $(".itemName").text(response[k].shortdescription);
        // add in custom ratings

        if (response[k].longdescription && response[k].longdescription.length !== 0 ) {
          $(".product-short-desc p").html(response[k].longdescription);
        } 

        if (response[k].onsale === "Y" ) {
          $("#detail-old-price").text('$' + response[k].price);
        }
        $("#detail-price").text('$' + response[k].msrp);

        $(".product-detail-qty").after('<a href="#" class="addtocart detailadd" title="Add to Cart" onclick="stock_no=\'' + response[k].itemnum + '\'; addItemDetailView(); return false;"><i class="fa fa-shopping-cart"></i><span>Add to Cart</span></a>');

       // addInfo =  '<tr><td class="table-label">Dimensions</td><td>' + fields[6] + '</td></tr>';
        addInfo = '<tr><td class="table-label">Item Number</td><td>' + response[k].itemnum + '</td></tr>';
        addInfo += '<tr><td class="table-label">Color</td><td>' + response[k].color + '</td></tr>';
        addInfo += '<tr><td class="table-label">Type</td><td>' + response[k].func + '</td></tr>';
        addInfo += '<tr><td class="table-label">Brand</td><td>' + response[k].program + '</td></tr>';
        addInfo += '<tr><td class="table-label">Material</td><td>' + response[k].material + '</td></tr>';

        //$("#images").html(pic);
       // $("#productGalleryThumbs").html(picsGallery);
        $("table.product-table tbody").html(addInfo);
       // $('.owl-carousel').owlCarousel('destroy');
       // $('.owl-carousel').owlCarousel('refresh');
        
      });
    },
    complete: function () {
      if (callback && typeof (callback) === "function") {
        callback(stock_no);
      }
      if (callback2 && typeof (callback2) === "function") {
        callback2(stock_no);
      }
    }
  });
}


//////////////////////////////
  // Populate the Review //
//////////////////////////////
function populateReviewModal()
{
  var cust_name = localStorage.getItem("cust_name").trim();
  var cust_no = localStorage.getItem("cust_no").trim();
  var email_addr = localStorage.getItem("email_addr").trim();
  var hash = window.location.hash.split("+");
  var stock_no = hash[1];
  var rLines;

  $("#reviewModalBody").empty();

  rLines  = '<form class="nobottommargin" id="template-reviewform" target="dummyframe" name="template-reviewform" action="https://netlink.laurajanelle.com:444/nlhelpers/mailer/review.php" method="GET"><div class="bottommargin-sm">';
  rLines += '<div class="white-section"><label>Rating:</label><input id="cust-rating" name="rating" class="rating-loading" data-size="sm"></div></div><div class="clear"></div>';
  rLines += '<div class="col_full"><label for="template-reviewform-comment">Comment <small>*</small></label><input type="hidden" name="custname" value="'+ cust_name +'" />';
  rLines += '<textarea class="required form-control" id="template-reviewform-comment" name="comment" rows="6" cols="30"></textarea></div><input type="hidden" name="custnum" value="'+ cust_no +'" />';
  rLines += '<input type="hidden" name="email" value="'+ email_addr +'" /><input type="hidden" name="item" value="'+ stock_no +'" /><input type="hidden" name="source" value="LJ website" /><div class="col_full nobottommargin">';
  rLines += '<button class="button button-3d nomargin" type="submit" id="template-reviewform-submit" name="template-reviewform-submit" value="submit" onclick="$(\'#fakeRevQuestion\').click();">Submit Review</button></div></form>';

  $("#reviewModalBody").html(rLines);
  
  $('#cust-rating').rating({
      step: 1,
      starCaptions: {1: 'Not for me', 2: 'I\’d probably re-gift it', 3: 'It\'s okay', 4: 'I really like it', 5: 'I love it'},
      starCaptionClasses: {1: 'text-danger', 2: 'text-warning', 3: 'text-info', 4: 'text-primary', 5: 'text-success'}, 
      showClear: false, 
      showCaption: true
  });
}

function getReviews(stock_no)
{
  productRating = [];

  $("#listOfReviews").empty();
  $("#number-of-reviews").empty();
  var reviewhtml = [];
  $.get("https://netlink.laurajanelle.com:444/nlhelpers/mailer/review.php?comment=&custname=&custnum=&rating=&item="+ stock_no +"&email=&source=", function ( reviewdata ) {
    rdata = reviewdata.split("\n");
    if (rdata.length < 2) {
      custrLines = '<li>Be the first to review this product</li>';
      $("#listOfReviews").prepend(custrLines);
      $("#mainRatingDiv").html('<a href="#" onclick="$(\'#addReviewButton\').click(); return false;">Be the first to review this item</a>');
    } else {
      $("#mainRatingDiv").html('<div class="white-section different-stars"><input id="mainRating" type="number" class="rating" max="5" value="" data-size="xs" disabled></div>');
      for (i=0; i<rdata.length - 1; i++) {
        rdatalines    = rdata[i].split("|");
        dateAddedPre  = Date(rdatalines[0]).split(" ");
        dateAddedPost = dateAddedPre[1] + " " + dateAddedPre[2].replace(/^[0]+/g,"")+ ", " + dateAddedPre[3];
        dateAppPre    = Date(rdatalines[1]).split(" ");
        dateAppPost   = dateAppPre[1] + " " + dateAppPre[2].replace(/^[0]+/g,"")+ ", " + dateAppPre[3];

        custrLines  = '<li class="comment even thread-even depth-1" id="li-comment-'+ i +'"><div id="comment-'+ i +'" class="comment-wrap clearfix"><div class="comment-content clearfix"><div class="comment-author">'+ rdatalines[3] +'<span>';
        custrLines += '<a>'+ dateAddedPost +'</a></span></div><div class="white-section different-stars"><input id="rating-'+ i +'" value="'+ rdatalines[6] +'" class="rating-loading" data-size="xs" readonly></div>';
        custrLines += '<p class="notopmargin">'+ rdatalines[2] +'</p></div><div class="clear"></div></div></li>';

        if (rdatalines[4].length>3) {
          custrLines += '<li class="comment odd thread-odd depth-2" id="li-comment-'+ i +'"><div id="comment-'+ i +'" class="comment-wrap clearfix"><div class="comment-meta"><div class="comment-author vcard"><span class="comment-avatar clearfix">';
          custrLines += '<img alt="reply arrow" src="../img/reply.png" height="60" width="60" /></span></div></div><div class="comment-content clearfix"><div class="comment-author">'+ rdatalines[5] +'<span><a>'+ dateAppPost +'</a>';
          custrLines += '</span></div><p>'+ rdatalines[4] +'</p></div><div class="clear"></div></div></li>';
        }
         custrLines += '<hr>';
        if (rdatalines[8] === "1") {
          reviewhtml.unshift(custrLines);
        } else {
          reviewhtml.push(custrLines);
        }

        productRating.push(rdatalines[6]);
      }

      $("#listOfReviews").html(reviewhtml.join(''));
      for (i=0; i<rdata.length - 1; i++) {
        $('#rating-'+i+'').rating({ showClear: false, showCaption: false });
      }

      $('#mainRating').val(getAvg(productRating));
      $('#mainRating').rating('refresh', {showClear: false, showCaption: false});
    }
    $("#number-of-reviews").html("Reviews ("+ (rdata.length - 1) +")");
  });
}

function getAvg(elmt)
{
  var sum = 0;
  for( var i = 0; i < elmt.length; i++ ){
      sum += parseInt( elmt[i], 10 ); //don't forget to add the base
  }
  var avg = sum/elmt.length;
  return avg.toFixed(2);
}




////////////////////////////////////////
/// SUBROUTINE- Add item to the cart ///
////////////////////////////////////////
function addItemGeneric(session_no, stock_no, qty) {
  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTADD&session_no=" + session_no + "&stock_no=" + stock_no + "&qty=" + qty + "");
  cart();
  
}

function addItemWhileUpdating(session_no, stock_no, qty) {
  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTADD&session_no=" + session_no + "&stock_no=" + stock_no + "&qty=" + qty + "");
}
//////////////////////////////////////////////
// Add item to the cart for the detail page //
//////////////////////////////////////////////
function addItemDetailView() {
  var detailViewQty;
  if (document.getElementById("product-vqty")) {
    detailViewQty = document.getElementById("product-vqty").value;
  } else {
    detailViewQty = "1";
  }

  addItemGeneric(session_no, stock_no, detailViewQty);

  if (window.location.hash !== "#products") {
    window.location.hash = "cart";
  }
}



/////////////////////////////////////////
// SUBROUTINE - REMOVE ITEMS FROM CART //
/////////////////////////////////////////
function removeItem(session_no, line_no) {
  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTREM&session_no=" + session_no + "&line_no=" + line_no + "");
  cart();
}
function removeItemWhileUpdating(session_no, line_no) {
  return $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTREM&session_no=" + session_no + "&line_no=" + line_no + "");
}

////////////////////////////////////////
// SUBROUTINE - DELETE THE WHOLE CART //
////////////////////////////////////////
function deleteCart() {
  if (confirm("Are you sure?") === true) {
    $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTDEL&session_no=" + session_no + "");
    cart();
    $("table.totals-table tbody").html('<tr><td>Subtotal</td><td>$0.00</td></tr><tr id="cart-grand-total"><td>Grand Total</td><td>$0.00</td></tr>');
    $(".cart-qty").text("");
  }
}


////////////////////////\\
// Update Cart Function \\
//\\\\\\\\\\\\\\\\\\\\\\\\

function updateCart(callback) 
{
  //$("#updateCartButton").hide();
  UpdatedShoppingCart = {};
  newItems ={};
  var table = $("table.cart-table tbody");
  // loop thru cart and flatten the items that are repeated
  table.find('tr').each(function () {
    var line_no = $(this).find('td.product-action-td a').attr('id');
    var stockNumber = $(this).find('td.product-image-td a').attr('title');
    var qty = parseInt($(this).find('td:nth-child(5) div input:nth-child(2)').val());

    if (!newItems.hasOwnProperty(stockNumber.trim())) {
      newItems[stockNumber.trim()] = [parseInt(qty), line_no];
    } else {
      newItems[stockNumber.trim()][0] += parseInt(qty);
    }
    UpdatedShoppingCart[line_no] = [parseInt(qty), stockNumber.trim()];
  });
  loopCart();
  addItemsBack(cart);
  if (callback && typeof (callback) === "function") {
    callback();
  }
}

function addItemsBack(callback) {
  calls = [];
  $.each(newItems, function (key, value) { 
    $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTADD&session_no=" + session_no + "&stock_no=" + key + "&qty=" + value[0] + "", function(response) {
      if ( response.length !== 0 ) {
        $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTADD&session_no=" + session_no + "&stock_no=" + key + "&qty=" + value[0] + "");
      }
    });
  });

  if (callback && typeof (callback) === "function") {
    callback();
  }
}

function loopCart(callback) 
{
  $.each(UpdatedShoppingCart, function (key, value) {
      removeItemWhileUpdating(session_no, key);
  });

  if (callback && typeof (callback) === "function") {
    callback(addItemsBack);
  }
}


//////////////////////////////
// Get back the cart header //
//////////////////////////////
function cartHeader(callback) {
  jQuery.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APICARTH",
      session_no: session_no
    },
    success: function (response) {
      console.log(response);
      hideSmallCart();
      cartheader = response.split("\n");
      
      if (cartheader.length >= 3) {
        
        cartHeaderFields = cartheader[1].split("|");
        getTax(cartHeaderFields[7]);
        calculateShipping(cartHeaderFields[22], cartHeaderFields[19]);
        
        if (window.location.hash === "#checkout") {
          document.getElementById("billing-form-name").value = cartHeaderFields[2].trim();
          document.getElementById("billing-form-email").value = cartHeaderFields[17].trim();
          document.getElementById("billing-form-address").value = cartHeaderFields[3].trim();
          document.getElementById("billing-form-address2").value = cartHeaderFields[4].trim();
          document.getElementById("billing-form-address3").value = cartHeaderFields[5].trim();
          document.getElementById("billing-form-city").value = cartHeaderFields[6].trim();
          document.getElementById("billing-form-state").value = cartHeaderFields[7].trim();
          document.getElementById("billing-form-zipcode").value = cartHeaderFields[8].trim();
          document.getElementById("billing-form-phone").value = cartHeaderFields[18].trim();
          document.getElementById("shipping-form-name").value = cartHeaderFields[9].trim();
          document.getElementById("shipping-form-address").value = cartHeaderFields[10].trim();
          document.getElementById("shipping-form-address2").value = cartHeaderFields[11].trim();
          document.getElementById("shipping-form-address3").value = cartHeaderFields[12].trim();
          document.getElementById("shipping-form-city").value = cartHeaderFields[13].trim();
          document.getElementById("shipping-form-state").value = cartHeaderFields[14].trim();
          document.getElementById("shipping-form-zipcode").value = cartHeaderFields[15].trim();
          getTax(cartHeaderFields[7]);
        }
        if (window.location.hash === "#dashboard") {
          $("#default-billing-address").html(cartHeaderFields[3].trim() + ' ' + cartHeaderFields[4].trim() + ' ' + cartHeaderFields[5].trim() + '<br>' + cartHeaderFields[6].trim() + ', ' + cartHeaderFields[7] + ' ' + cartHeaderFields[8].trim());
          $("#default-shipping-address").html(cartHeaderFields[10].trim() + ' ' + cartHeaderFields[11].trim() + ' ' + cartHeaderFields[12].trim() + '<br>' + cartHeaderFields[13].trim() + ', ' + cartHeaderFields[14] + ' ' + cartHeaderFields[15].trim() + '<br>');
        }
      }
    },
    complete: function () {
      if (callback && typeof (callback) === "function") {
        callback();
      }
      updateTotals();
    }
  });
}
function updateTotals()
{
  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTH&session_no=" + session_no + "", function (response) {
    cartheader = response.split("\n");
    
    if (cartheader.length >= 3) {
      
      cartHeaderFields = cartheader[1].split("|");
      $(".cart-qty").text(cartHeaderFields[24].trim());
      //$(".cart-totals span").text('$' + cartHeaderFields[19].trim());
      $("table.totals-table tbody").html('<tr id="subtotal-amount"><td>Subtotal</td><td>$' + cartHeaderFields[19].trim() + '</td></tr><tr class="show-tax"><td>Tax</td><td>$' + cartHeaderFields[21].trim() + '</td></tr><tr id="cart-grand-total"><td>Grand Total</td><td>$' + cartHeaderFields[22].trim() + '</td></tr>');
      if (localStorage.getItem('username') !== "Guest") {
        $("table.totals-table tbody").prepend('<tr class="discount-percentage"><td>Discount Percentage</td><td>-10%</td></tr>');
      }
      if (parseFloat(cartHeaderFields[19].replace(/[, ]/g, '')) > 25) {
        $("#subtotal-amount").after('<tr><td>Shipping</td><td>FREE</td></tr>');
      } else {
        $("#subtotal-amount").after('<tr><td>Shipping</td><td>$5.00</td></tr>');
      }
    }
  });
}
///////////////////////
// Shipping Function //
///////////////////////
function calculateShipping(total, subtotal)
{
  var discount_amt;
  var shipWhat = 25 - parseFloat(cartHeaderFields[19].replace(/[, ]/g, ''));
  if ( subtotal.trim() === ".00") {
    $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&misc_code1=&misc_amt1=0.00");
    $("#freeShip").html('<input type="radio" value="shipping-method-1" name="shipping[method]" checked="checked"> Free Shipping');
  } else {
    if (localStorage.getItem('username') === "Guest") {
      if (parseFloat(subtotal.replace(/[, ]/g, '')) > 25 ) {
        discount_amt = "0.00";
        $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&misc_code1=&misc_amt1=" + discount_amt + "");
        $("#freeShip").html('<input type="radio" value="shipping-method-1" name="shipping[method]" checked="checked"> Free Shipping');
      } else {
        discount_amt = "5.00";
        $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&misc_code1=FT&misc_amt1=" + discount_amt + "");
        $("#freeShip").html('<input type="radio" value="shipping-method-2" name="shipping[method]" checked="checked">Fixed <span class="text-primary">$5.00</span>');
      }
    } else {
      if (parseFloat(subtotal.replace(/[, ]/g, '')) > 25 ) {
        discount_amt = 0 - (parseFloat(subtotal.replace(/[, ]/g, '')) * 0.1);
        discount_amt = discount_amt.toFixed(2);
        $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&misc_code1=&misc_amt1=" + discount_amt + "");
        $("#freeShip").html('<input type="radio" value="shipping-method-1" name="shipping[method]" checked="checked"> Free Shipping');
      } else {
        discount_amt = 5 - (subtotal.replace(/[, ]/g, '') * 0.1);
        discount_amt = discount_amt.toFixed(2);
        $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&misc_code1=FT&misc_amt1=" + discount_amt + "");
        $("#freeShip").html('<input type="radio" value="shipping-method-2" name="shipping[method]" checked="checked">Fixed <span class="text-primary">$5.00</span>');
        $("#get-free-shipping").empty();
        $("#get-free-shipping").text('         \(Spend $'+shipWhat.toFixed(2)+' more to receive free shipping!\) ');
      }
    }
  }
}

////////////////////
// Get Line items //
////////////////////
function cartList() {
  jQuery.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APICARTL",
      session_no: session_no
    },
    success: function (response) {
      cartitems = response.split("\n");
      html = [];
      html2 = [];
      
      jQuery(".cart-products").empty();
      cartHelper();
      if (window.location.hash === "#cart") {
        $("table.cart-table tbody").empty();
        $("table.cart-table tbody").prepend(html.join(''));
        jQuery('#COUPONWEMISSU').parent().hide();
      } else if (window.location.hash === "#checkout") {
        $("table#reviewItemTable tbody").empty();
      }
    }
  });
}

/////////////////////////////////////////////
// SUBROUTINE - CONSTRUCTING THE CART LIST //
/////////////////////////////////////////////
function cartHelper() 
{
  shoppingCart = {};
  if (cartitems.length > 2) {
    
    for (i = 1; i < cartitems.length - 1; i++) {
      data = cartitems[i].split("|");
    
      miniitem =  '<div class="product product-sm"><a href="#" onclick="removeItem(\'' + session_no + '\', \'' + data[1].replace(/\s+/g, '') + '\'); return false;" class="btn-remove" title="Remove Product"><i class="fa fa-times"></i></a>';
      if ( notbanned.indexOf(data[2].replace(/\s+/g, '')) != -1 ) { 
        miniitem += '<figure class="product-image-area"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="Product Name" class="product-image"><img src="https://www.primaDIY.com/productimages/' + data[2].replace(/\s+/g, '') + '-pk-sm.jpg" alt="Product Name"></a></figure>';
      } else {
        miniitem += '<figure class="product-image-area"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="Product Name" class="product-image"><img src="https://www.primaDIY.com/productimages/' + data[2].replace(/\s+/g, '') + '-sm.jpg" alt="Product Name"></a></figure>';
      }
      miniitem += '<div class="product-details-area"><h2 class="product-name"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="Product Name">' + data[3] + '</a></h2><div class="cart-qty-price">' + data[6].replace(/\s+/g, '') + ' X <span class="product-price">$' + data[7].substring(0, data[7].length - 3).trim() + '</span></div></div></div>';

      html2.push(miniitem);

      if (!shoppingCart.hasOwnProperty(data[2].replace(/\s+/g, ''))) {
        shoppingCart[data[2].replace(/\s+/g, '') ] = [ parseInt(data[6].replace(/\s+/g, '')),  data[1].trim()];
      } else {
         shoppingCart[data[2].replace(/\s+/g, '')][0] += parseInt(data[6]);
      }

      if (window.location.hash === "#cart") {
        listitem =  '<tr><td class="product-action-td"><a href="#" title="Remove product" class="btn-remove" onclick="removeItem(\'' + session_no + '\', \'' + data[1].replace(/\s+/g, '') + '\'); return false;" id="' + data[1].replace(/\s+/g, '') + '"><i class="fa fa-times"></i></a></td>';
        if ( notbanned.indexOf(data[2].replace(/\s+/g, '')) != -1 ) {
          listitem += '<td class="product-image-td"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="' + data[2].replace(/\s+/g, '') + '"><img src="https://www.primaDIY.com/productimages/' + data[2].replace(/\s+/g, '') + '-pk-sm.jpg" alt="' + data[3] + '"></a></td>';
        } else {
          listitem += '<td class="product-image-td"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="' + data[2].replace(/\s+/g, '') + '"><img src="https://www.primaDIY.com/productimages/' + data[2].replace(/\s+/g, '') + '-sm.jpg" alt="' + data[3] + '"></a></td>';
        } 
        listitem += '<td class="product-name-td"><h2 class="product-name"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="Product Name">' + data[3] +'' +data[4]+ '</a></h2></td><td>$' + data[7].substring(0, data[7].length - 3) + '</td><td><div class="qty-holder">';
        listitem += '<input type="button" class="qty-dec-btn" title="Dec" value="-" data-type="minus" data-field="quant[' + i + ']" onclick="changeQuantity(this);" />';
        listitem += '<input type="text" class="qty-input" name="quant[' + i + ']" min="1" value="' + data[6].replace(/\s+/g, '') + '" id="' + data[2].replace(/\s+/g, '') + '" />';
        listitem += '<input type="button" class="qty-inc-btn" title="Inc" value="+" data-type="plus" data-field="quant[' + i + ']" onclick="changeQuantity(this);" />';
        listitem += '</div></td><td><span class="text-primary">$' + data[8].substring(0, data[8].length - 4) + '</span></td></tr>';

        html.push(listitem);
      }
      
    }
    $("div.cart-products").append(html2.join(''));
  } else {
    item = '<tr class="cart_item products"><td class="cart-product-remove"><h1> Cart is empty</h1></td></tr>';
    html.push(item);
  }
  
}


/////////////////////////
  // GETTING FL TAX //
/////////////////////////
function getTax(billstate)
{
  if (billstate) {
    if( billstate.toLowerCase() === "fl" && gotTax === false) {
      $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&tax_code=Y");
      gotTax = true;
    } else if (billstate.toLowerCase() !== "fl" && gotTax === true) {
      $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&tax_code=");
      gotTax = false;
    }
  }
}


/////////////////////////
// Credit Card Process //
/////////////////////////
function creditCard(n) {
  var neworder;
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APIORDLST",
      session_no: session_no
    },
    success: function (response) {
      $(window).on('hashchange', function() {
        location.reload();
      });
      openlines = response.split("\n");
      if (n === 1) {
        numberOfOrders = openlines.length;
      }
      newNumberOfOrders = openlines.length;
      
      if (numberOfOrders != newNumberOfOrders) {
        hideCC = true;
        orders = [];
        for (i = 1; i < openlines.length - 1; i++) {
          fields = openlines[i].split("|");
          orders.push(fields);
        }
        orders = orders.sort(function (a, b) {
          return a[1] > b[1] ? -1 : 1;
        });
        newOrder = orders[0][0];
        $("#success").click();
        $("#successMessage").empty();
        var message = '<h4 style="font-family: Lato;">Your order # is: ' + newOrder + '</h4>';
        message += '<p>This is a confirmation that your order has been successfully received and is currently being processed. You will receive an email soon with a copy of your invoice, which also includes the details of your order.</p>';
        message += '<p class="nobottommargin">PrimaDIY values your business and is continuously looking for ways to better satisfy their customers. Please share with us if there is a way we can serve you better.</p>';

        document.getElementById("successMessage").innerHTML += message;

        windowHash("orders");
        return $.get("https://netlink.laurajanelle.com:444/mailer/prima_order_confirmation.php?session_no=" + session_no + "&order_no=" + newOrder + "");
      } else {
        return setTimeout(function () {
          creditCard(n + 1);
        }, 3000);
      }
    }
  });
}

function accountDetails() {
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APIACCTINFO",
      user: username
    },
    success: function (response) {

      lines = response.split("\n");
      // lines[0] is header row
      // lines[1]+ are data lines
      $('#account-details, #contact-information').empty();
      for (i = 0; i < lines.length - 1; i++) {
        details = lines[i].split("|");
        $('#contact-information').html('<strong>Customer Name:</strong> ' + details[2] + '<br><strong>Email Address:</strong> ' + details[3] + '<br><strong>Phone Number:</strong>' + details[4]);
        $('#account-details').html('<strong>Username:</strong> ' + details[0] + '<br><strong>Customer Number:</strong> ' + details[1] + '<br><strong>Session Number:</strong> ' + session_no);

      }
    }
  });
}



/////////////////////////////////////////
// OPEN ORDER API Function - APIORDLST //
/////////////////////////////////////////
function openOrders() {
  var openlines,
    openfldsArray = {
      "data": []
    },
    openfldsArray_json,
    fields;
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APIORDLST",
      session_no: session_no
    },
    success: function (response) {
      openlines = response.split("\n");
      // lines[0] is header row
      // lines[1]+ are data lines

      for (i = 1; i < openlines.length - 1; i++) {
        fields = openlines[i].split("|");
        fields.splice(3, 1);
        fields.splice(6, 1);
        fields.splice(6, 1);
        fields.splice(6, 1);
        openfldsArray.data.push(fields);
      }
      openfldsArray = JSON.stringify(openfldsArray);
      openfldsArray_json = $.parseJSON(openfldsArray);
    },
    complete: function () {
      table1 = $('#datatable1').DataTable();
      table1.clear();
      table1.rows.add(openfldsArray_json.data).draw();
    }
  });
}



/////////////////////////////////////////////
// ORDER/INVOICE API Function - APIHISTLST //
/////////////////////////////////////////////
function orderHistory() {
  var fldsArray = {
      "data": []
    },
    lines,
    fldsArray_json,
    flds;
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APIHISTLST",
      session_no: session_no
    },
    success: function (response) {
      lines = response.split("\n");
      // lines[0] is header row
      // lines[1]+ are data lines
      // $('#tableBody').empty();
      for (i = 1; i < lines.length - 1; i++) {
        flds = lines[i].split("|");
        flds.splice(5, 1);
        flds.splice(5, 1);
        flds.splice(9, 1);
        flds.splice(7, 1);
        flds.splice(7, 1);
        flds.splice(7, 1);

        fldsArray.data.push(flds);
      }
      fldsArray = JSON.stringify(fldsArray);
      fldsArray_json = $.parseJSON(fldsArray);
    },
    complete: function () {
      table = $('#datatable2').DataTable();
      table.clear();
      table.rows.add(fldsArray_json.data).draw();

      table5 = $('#datatable5').DataTable();
      table5.clear();
      table5.rows.add(fldsArray_json.data).draw();
    }
  });
}


/////////////////////////////////////////////
//  Hash loads Ajax. Let's Make this go faster.. //
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function hideSmallCart() 
{
  if ( Object.keys(shoppingCart).length === 0 ) {
    $('.small-cart-list').hide();
  } else {
    $('.small-cart-list').show();
  }
}

function currentAsideLink(hash) {
  $('ul.nav.nav-list li.' + hash + '-link').addClass("active");
}

function cart() {
  cartHeader();
  cartList();
}

function checkoutPage() {
 
  session_no = localStorage.getItem('session_no');
  username = localStorage.getItem('username');
  if (loginModal && username === "Guest") {
    $('.modalopen').click();
    loginModal = false;
  }
  billingAddresses = [];
  shippingAddresses = [];
  billstate = $('#billing-form-state').val();
  shipstate = $('#shipping-form-state').val();
  $("#creditcard").hide();

  $("#billing-address, #shipping-address").empty();
  fillAddresses();

  document.getElementById("creditcard").src = "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICC&session_no=" + session_no + "";
  

  $("#myButton").click(function (e, callback) {
    $("#billingForm, #shippingForm").validate();
    var isBillValid = $("#billingForm").valid();
    var isShipValid = $("#shippingForm").valid();

    if (!isBillValid || !isShipValid) {
      e.preventDefault();
      alert("Form has errors");
    } else {
     
      saveAddresses();
      $("#creditcard").slideDown("slow");
      $("#myButton").hide();
      creditCard(1);
    }
  });
}

/////////////////////////////////////////////
//Store Router and Procedures. 
/////////////////////////////////////////////
function whichPage() {
  var hashy = window.location.hash.split("+");
  var locale = hashy[0];
  var shopParamsName = localStorage.getItem('shopParams').split(",");
  $('#shopHashName').text(locale.slice(1));
 
  $('div.store-page').hide();
  switch (locale) {
    case '#products':
      if (!localStorage.getItem('shopParams')) {
        localStorage.setItem('shopParams', ['all','4']);
      }
      fillShop();
      $('#products').show();
      cart();
      $('#shopParamName').text(shopParamsName[0]);
      break;
    case '#product-details':
      $('#product-details').show();

      window.scrollTo(0, 0);
      detailView(); //detailView(getQuestions, getReviews);
      cart();
      /*
      $('#questionField').keypress(function(e){
        if(e.which == 13 && ($('#questionField').val() !== "")) {//Enter key pressed
          $('#questionModal').click();//Trigger search button click event
          populateQuestionModal();
        }
      });
      */
    
      break;
      
    case '#cart':
      window.scrollTo(0, 0);
      $('#cart').show();
      cart();
      break;
    case '#checkout':
      window.scrollTo(0, 0);
      $('#checkout').show();
      cart();
      checkoutPage();
      break;
    case '#dashboard':
      window.scrollTo(0, 0);
      currentAsideLink("dashboard");
      $('#dashboard').show();
      username = localStorage.getItem('username').toUpperCase();
      cart();
      accountDetails();

      break;

    case '#invoices':
      window.scrollTo(0, 0);
      $('#invoices').show();
      currentAsideLink("invoices");
      $("#details-title, #details-table, #line-item-title, #line-item-table").hide();
      orderHistory();
      $('#searchForInvoices').click(function () {
        var invoiceSearchNumber = $('#invoiceNumber').val();
        searchInvoices(invoiceSearchNumber);
      });
      $('#invoiceNumber').keypress(function (e) {
        if (e.which == 13) { //Enter key pressed
          $('#searchForInvoices').click(); //Trigger search button click event
        }
      });
      break;
    case '#orders':
      window.scrollTo(0, 0);
      currentAsideLink("orders");
      $('#orders').show();
      $("#orders-details-title, #orders-details-table, #orders-line-item-title, #orders-line-item-table").hide();
      openOrders();
      orderHistory();
      $('#searchForOrders').click(function () {
        var orderSearchNumber = $('#orderNumber').val();
        searchOrders(orderSearchNumber);
      });
      $('#orderNumber').keypress(function (e) {
        if (e.which == 13) { //Enter key pressed
          $('#searchForOrders').click(); //Trigger search button click event
        }
      });
      break;
    case '#faq':
      window.scrollTo(0, 0);
      $('#faq').show();
      break;
    default:
      window.scrollTo(0, 0);
      if (!localStorage.getItem('shopParams')) {
        localStorage.setItem('shopParams', ['all','4']);
      }
      fillShop();
      $('#products').show();
      cart();
  }
}



///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//////////////////////// HELPER FUNCTIONS / SUBROUTINES ///////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////
// redirect with hash add ins  //
/////////////////////////////////////////////////////
function redirect(pathname) {
  pathArray = window.location.pathname.split('/');
  pathArray[pathArray.length - 2] = pathname;
  window.location.pathname = pathArray.join('/');
}

function windowHash(name) {
  window.location.hash = name;
  return false;
}


/////////////////////////////////////////////////////
// Get Session Number and Authorize Access to Page //
/////////////////////////////////////////////////////
function sessionNumber() 
{
  session_no = localStorage.getItem('session_no');
  if (typeof (session_no) === "undefined" || session_no === null || session_no.length !== 25 ) {
    guestLogin();
    setTimeout(function(){ location.reload(); }, 1000);
  }
}

function logoff()
{
  localStorage.removeItem('session_no');
  localStorage.removeItem('newCustomer');
  localStorage.removeItem('username');
  redirect("/");
}


//////////////////////////////////////
// Functionality of + and - Buttons //
//////////////////////////////////////
function changeQuantity(element) {
  var fieldName = jQuery(element).attr('data-field');
  var type = jQuery(element).attr('data-type');
  var input = jQuery("input[name='" + fieldName + "']");
  var currentVal = parseInt(input.val());
  if (!isNaN(currentVal)) {
    if (type == 'minus') {
      var minValue = parseInt(input.attr('min'));
      if (!minValue) minValue = 1;
      if (currentVal > minValue) {
        input.val(currentVal - 1).change();
      }
      if (parseInt(input.val()) == minValue) {
        jQuery(element).attr('disabled', true);
      }
    } else if (type == 'plus') {
      var maxValue = parseInt(input.attr('max'));
      if (!maxValue) maxValue = 9999999999999;
      if (currentVal < maxValue) {
        input.val(currentVal + 1).change();
      }
      if (parseInt(input.val()) == maxValue) {
        jQuery(element).attr('disabled', true);
      }
    }
  } else {
    input.val(0);
  }

  jQuery('.input-number').focusin(function () {
    jQuery(element).data('oldValue', jQuery(element).val());
  });
  jQuery('.input-number').change(function () {
    var minValue = parseInt(input.attr('min'));
    var maxValue = parseInt(input.attr('max'));
    if (!minValue) minValue = 1;
    if (!maxValue) maxValue = 9999999999999;
    var valueCurrent = parseInt(input.val());
  });
  return false;
}



//////////////////////////////////////
// Functionality of toggle colors //
//////////////////////////////////////
$('input.color-selector:checkbox').change(function(){
  color = $(this).attr('id');
  this.checked ? $('#'+color+'1 a span').addClass("selected-color") : $('#'+color+'1 a span').removeClass("selected-color");
});

$('input#billing-form-state').blur( function() {
  billstate = $('#billing-form-state').val();
  getTax(billstate);
  updateTotals();
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PULL SAVED BILL TO ADDRESSES //
/////////////////////////////////////////////
/////////////////////////////////////////
// Saving Addresses from Checkout Page //
/////////////////////////////////////////
function saveAddresses() {
  var billingformname = $("#billing-form-companyname").val();
  var billingformaddress = $("#billing-form-address").val();
  var billingformaddress2 = $("#billing-form-address2").val();
  var billingformaddress3 = $("#billing-form-address3").val();
  var billingformcity = $("#billing-form-city").val();
  var billingformstate = $("#billing-form-state").val();
  var billingformzipcode = $("#billing-form-zipcode").val();

  var shippingformname = $("#shipping-form-name").val();
  var shippingformaddress = $("#shipping-form-address").val();
  var shippingformaddress2 = $("#shipping-form-address2").val();
  var shippingformaddress3 = $("#shipping-form-address3").val();
  var shippingformcity = $("#shipping-form-city").val();
  var shippingformstate = $("#shipping-form-state").val();
  var shippingformzipcode = $("#shipping-form-zipcode").val();

  var email_addr = $("#billing-form-email").val();
  var phone = $("#billing-form-phone").val();
  var ponumber = $("#shipping-form-ponumber").val();

  var text1 = "";
  var text2 = "";
  var text3 = "";
  var text4 = "";
  var text5 = "";
  var notesArray = [];
  var shippingPrice;


  if ($("#shipping-form-message").val()) {
    notesArray = $("#shipping-form-message").val().match(/.{1,30}/g);
    if (notesArray[0] && typeof (notesArray[0]) === "string") {
      text1 = notesArray[0];
    }
    if (notesArray[1] && typeof (notesArray[1]) === "string") {
      text2 = notesArray[1];
    }
    if (notesArray[2] && typeof (notesArray[2]) === "string") {
      text3 = notesArray[2];
    }
    if (notesArray[3] && typeof (notesArray[3]) === "string") {
      text4 = notesArray[3];
    }
    if (notesArray[4] && typeof (notesArray[4]) === "string") {
      text5 = notesArray[4];
    }
  }

  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APICARTUPD",
      session_no: session_no,
      billname: billingformname,
      billadd1: billingformaddress,
      billadd2: billingformaddress2,
      billadd3: billingformaddress3,
      billcity: billingformcity,
      billstate: billingformstate,
      billzip: billingformzipcode,
      shipname: shippingformname,
      shipadd1: shippingformaddress,
      shipadd2: shippingformaddress2,
      shipadd3: shippingformaddress3,
      shipcity: shippingformcity,
      shipstate: shippingformstate,
      shipzip: shippingformzipcode,
      phone: phone,
      email_addr: email_addr,
      po_no: ponumber,
      text1: text1,
      text2: text2,
      text3: text3,
      text4: text4,
      text5: text5
    }
  });
}


function fillAddresses() {
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APIBIILLST",
      session_no: session_no
    },
    success: function (response) {

      billLines = response.split("\n");

      for (i = 1; i < billLines.length - 1; i++) {
        billflds = billLines[i].split("|");
        billingAddresses.push([billflds[1], billflds[2], billflds[3], billflds[4], billflds[5], billflds[6], billflds[7]]);
        document.getElementById("billing-address").innerHTML += '<option value="' + i + '">' + billflds[1] + ', ' + billflds[2] + '</option>';
      }
      $("#billing-address").prepend('<option selected="selected">Select Billing Address</option>');
     
    }, 
    complete: function() {
      if (localStorage.getItem('username') === "Guest") {
        $('#billing-form-name, #billing-form-address, #shipping-form-name, #shipping-form-address').val("");
      }
    }
  });

  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APISHIPLST",
      session_no: session_no
    },
    success: function (response) {

      shipLines = response.split("\n");

      for (i = 1; i < shipLines.length - 1; i++) {
        shipflds = shipLines[i].split("|");
        shippingAddresses.push([shipflds[1], shipflds[2], shipflds[3], shipflds[4], shipflds[5], shipflds[6], shipflds[7]]);
        document.getElementById("shipping-address").innerHTML += '<option value="' + i + '">' + shipflds[1].trim() + ' - ' + shipflds[2] + '</option>';
      }
      $("#shipping-address").prepend('<option selected="selected">Select Shipping Address</option>');
    }, 
    complete: function() {
      if (localStorage.getItem('username') === "Guest") {
        $('#billing-form-name, #billing-form-address, #shipping-form-name, #shipping-form-address').val("");
      }
    }
  });
}

function displayShippingAddress(index) {
  var ind = index - 1;
  document.getElementById("shipping-form-name").value = shippingAddresses[ind][0].trim();
  document.getElementById("shipping-form-address").value = shippingAddresses[ind][1].trim();
  document.getElementById("shipping-form-address2").value = shippingAddresses[ind][2].trim();
  document.getElementById("shipping-form-address3").value = shippingAddresses[ind][3].trim();
  document.getElementById("shipping-form-city").value = shippingAddresses[ind][4].trim();
  document.getElementById("shipping-form-state").value = shippingAddresses[ind][5].trim();
  document.getElementById("shipping-form-zipcode").value = shippingAddresses[ind][6].trim();
}

function displayBillingAddress(index) {
  var ind = index - 1;
  document.getElementById("billing-form-name").value = billingAddresses[ind][0].trim();
  document.getElementById("billing-form-address").value = billingAddresses[ind][1].trim();
  document.getElementById("billing-form-address2").value = billingAddresses[ind][2].trim();
  document.getElementById("billing-form-address3").value = billingAddresses[ind][3].trim();
  document.getElementById("billing-form-city").value = billingAddresses[ind][4].trim();
  document.getElementById("billing-form-state").value = billingAddresses[ind][5].trim();
  document.getElementById("billing-form-zipcode").value = billingAddresses[ind][6].trim();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function showAlert(e) {

  $.notify("The item has been added to your cart");
  // available: success, info, warning, danger
}

function dennyHover()
{
  $( '.dropdown-menu' ).hide();
  setTimeout(function(){ $( '.dropdown-menu' ).show(); }, 1000);
}


banned = [
  "2950513",
  "7120008",
  "7120009",
  "7120031",
  "7120106",
  "7120204",
  "7120207",
  "7120208",
  "7120209",
  "7120210",
  "7120214",
  "7120216",
  "7120220",
  "7120308",
  "7120309",
  "7120310",
  "7120311",
  "7120312",
  "7120314",
  "7120316",
  "7120317",
  "7120321",
  "7120322",
  "7120324",
  "7120326",
  "7120327",
  "7120328",
  "7120330",
  "29502176",
  "29502177",
  "29502178",
  "29502180",
  "34708429",
  "34708457",
  "34708458",
  "34708459",
  "34708460",
  "34708462",
  "34708463",
  "34708464",
  "34708467",
  "34708469",
  "34708470",
  "34708471",
  "34708472",
  "34708475",
  "34708476",
  "34708477",
  "34708481",
  "34708482",
  "34708483",
  "34708484",
  "34708487",
  "34708490",
  "34708493",
  "34708495",
  "34708502",
  "34708503",
  "34708504",
  "34708506",
  "34708512",
  "34708513",
  "34708515",
  "34708516",
  "34708517",
  "34708518",
  "34708527",
  "34708532",
  "34708535",
  "34708543",
  "34708545",
  "34708549",
  "34708551",
  "34708552",
  "34708553",
  "34708555",
  "34708560",
  "34708570",
  "34708571",
  "34708573",
  "34715034",
  "34715036",
  "34738054",
  "34738056",
  "34770201",
  "34770202",
  "34770203",
  "34770204",
  "34770205",
  "34770206",
  "34770207",
  "34770208",
  "34770209",
  "34770210",
  "34770211",
  "34770212",
  "34770213",
  "34770214",
  "34770215",
  "34770216",
  "34770217",
  "34770218",
  "34770219",
  "34770220",
  "34770221",
  "34770222",
  "34770223",
  "34770225",
  "34770226",
  "34770227",
  "34770228",
  "34770229",
  "34770230",
  "34770261",
  "34770263",
  "34770300",
  "34770301",
  "34770302",
  "34770305",
  "34770439",
  "34770445",
  "34770479",
  "34770503",
  "34770504",
  "34770506",
  "34774079",
  "34774081",
  "64116008",
  "72099423",
  "72099427",
  "74100070",
  "74100077",
  "77528350",
  "2591699",
  "2949909",
  "2949902"
];

notbanned = [
  '2950542',
  '2950543',
  '2950548',
  '2950550',
  '2950564',
  '2950572',
  '2950579',
  '3202102',
  '3244407',
  '3578897',
  '3949410',
  '3949413',
  '25788114',
  '25788115',
  '25788123',
  '25788132',
  '25788135',
  '25788138',
  '25788139',
  '25788141',
  '25788147',
  '25916126',
  '25916140',
  '29497168',
  '29497169',
  '29497172',
  '29497206',
  '29499133',
  '29499135',
  '29499136',
  '29499137',
  '29499138',
  '29499141',
  '29499142',
  '29499144',
  '29505125',
  '29505165',
  '29505167',
  '29505300',
  '29505301',
  '29505303',
  '29505304',
  '29505306',
  '29505309',
  '29505315',
  '29505316',
  '29505319',
  '29505400',
  '34696026',
  '34696038',
  '34696039',
  '34696040',
  '34696041',
  '34696042',
  '34696048',
  '34696061',
  '34696079',
  '34696104',
  '34696105',
  '34696106',
  '34696107',
  '34696108',
  '34696109',
  '34696111',
  '34696113',
  '34696117',
  '34696122',
  '34697026',
  '34697038',
  '34697040',
  '34697042',
  '34697046',
  '34697048',
  '34697049',
  '34697053',
  '34697054',
  '34697055',
  '34697056',
  '34697063',
  '34697085',
  '34697087',
  '34697090',
  '34697091',
  '34697092',
  '34697095',
  '34697105',
  '34697106',
  '34697108',
  '34697114',
  '34697115',
  '34697117',
  '34700007',
  '34700008',
  '34700010',
  '34700011',
  '34700012',
  '34700027',
  '34700068',
  '34706001',
  '34706003',
	'34706005',
  '34706006',
  '34706007',
  '34706008',
  '34706009',
  '34706010',
  '34706011',
  '34706012',
  '34708145',
  '34708169',
  '34708170',
  '34708171',
  '34708172',
  '34708173',
  '34708174',
  '34708175',
  '34708176',
  '34708177',
  '34708178',
  '34708179',
  '34708180',
  '34708181',
  '34708182',
  '34708184',
  '34708185',
  '34708186',
  '34708206',
  '34708209',
  '34708213',
  '34708215',
  '34708217',
  '34708218',
  '34708219',
  '34708222',
  '34708223',
  '34708224',
  '34708227',
  '34708229',
  '34708230',
  '34708231',
  '34708233',
  '34708235',
  '34708236',
  '34708237',
  '34708238',
  '34708240',
  '34708241',
  '34708245',
  '34708246',
  '34708248',
  '34708258',
  '34708259',
  '34708261',
  '34708281',
  '34708282',
  '34708284',
  '34708286',
  '34708289',
  '34708290',
  '34708291',
  '34708292',
  '34708293',
  '34708296',
  '34708297',
  '34708298',
  '34708307',
  '34708423',
  '34708430',
  '34714001',
  '34714007',
  '34714013',
  '34714018',
  '34714023',
  '34714024',
  '34714025',
  '34714048',
  '34714070',
  '34714072',
  '34714083',
  '34714084',
  '34714085',
  '34714089',
  '34714098',
  '34714112',
  '34714119',
  '34714125',
  '34714126',
  '34714127',
  '34716100',
  '34716101',
  '34716102',
  '34716105',
  '34716107',
  '34716109',
  '34716111',
  '34716113',
  '34716116',
  '34716122',
  '34716124',
  '34716125',
	'34716128',
  '34716129',
  '34716131',
  '34716132',
  '34716133',
  '34722004',
  '34722005',
  '34722007',
  '34722008',
  '34722009',
  '34722010',
  '34722015',
  '34722016',
  '34722017',
  '34722018',
  '34722019',
  '34722021',
  '34722022',
  '34722024',
  '34722027',
  '34722028',
  '34722029',
  '34722030',
  '34722031',
  '34722036',
  '34722037',
  '34722043',
  '34722044',
  '34722045',
  '34722049',
  '34722051',
  '34722052',
  '34722053',
  '34722056',
  '34722071',
  '34722073',
  '34722083',
  '34722091',
  '34722103',
  '34722104',
  '34733027',
  '34733030',
  '34733034',
  '34733055',
  '34733061',
  '34733080',
  '34733085',
  '34733089',
  '34733090',
  '34741002',
  '34741003',
  '34741004',
  '34741006',
  '34741007',
  '34741009',
  '34741011',
  '34741016',
  '34741018',
  '34741020',
  '34741021',
  '34741022',
  '34741025',
  '34741027',
  '34741028',
  '34741029',
  '34741030',
  '34741031',
  '34741032',
  '34741036',
  '34741037',
  '34741039',
  '34741040',
  '34741044',
  '34741048',
  '34741049',
  '34741052',
  '34741054',
  '34741055',
  '34741057',
  '34741059',
  '34741062',
  '34770480',
  '34770481',
  '39494132',
  '39494134',
  '39494139',
  '39494140',
  '39494141',
  '39494142',
  '39494144',
  '47523193',
  '47748100',
  '47748193',
  '2578813',
  '2578840',
  '2578865',
  '2578874',
  '2591607',
  '2591625',
  '2591650',
	'2591669',
  '2949744',
  '2949753',
  '2949759',
  '2949760',
  '2949889',
  '2949901',
  '2949906',
  '2949913',
  '2949914',
  '2949925',
  '2949936',
  '2949941',
  '2949942',
  '2949943',
  '2950509',
  '2950511',
  '2950512',
  '2950515',
  '2950522',
  '2950523',
  '2950527',
  '2950210',
  '2950211',
  '2950212',
  '2950214',
  '2950222',
  '2950224',
  '2950225',
  '2950227',
  '2950229',
  '2950230',
  '2950236',
  '2950237',
  '2950241',
  '2950248',
  '2950249',
  '2950255',
  '2950264',
  '2950272',
  '2950288',
  '2950293',
  '29502100',
  '29502104',
  '29502109',
  '29502112',
  '29502126',
  '29502165',
  '29502167',
  '29502168',
  '29502183',
  '29502206',
  '29502209',
  '29502217',
  '2950210',
  '2950211',
  '2950212',
  '2950214',
  '2950222',
  '2950224'
];


/*

$('#coupon1, #coupon2').keypress(function(e){
  if(e.which == 13 ) {
    e.preventDefault();
    beaderCoupon();
  }
});
function beaderCoupon()
{
  if (localStorage.getItem('couponUsed') !== "true") {
    itemsInCart = [];
    if ($('#coupon1').val().toUpperCase() === "WEMISSEDYOU" || $('#coupon2').val().toUpperCase() === "WEMISSEDYOU" ) {
      localStorage.setItem('couponUsed', "true");
      addItemGeneric(session_no, "COUPONWEMISSU", "1");
      $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTL&session_no=" + session_no + "", function(response) {
        couponcartitems = response.split("\n");
    
        if (couponcartitems.length > 2) {
          for (i = 1; i < couponcartitems.length - 1; i++) {
            coupondata = couponcartitems[i].split("|");
            itemsInCart.push(coupondata[2]);
          }
        }
        if ( itemsInCart.indexOf("7746222") != -1 ) { 
          return false;
        } else {
          addItemGeneric(session_no, "7746222", "1");
        }
      });
    }
  } else {
    return false;
  }
}

function filterFunction2(a, b, c, d, e, f, g, h) {
  $('#demo').jplist({
    command: 'empty'
   });
  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: a,
      level1: b,
      level2: c,
      level3: d,
      level4: e,
      level5: f,
      session_no: g,
      loc_no: h
    },
    success: function (response) {
      $('.jplist-reset-btn').click();
      $('#display-products').empty();
      itemRender("display-products", response);

    }
  });
}

function itemRender(div, response) {
  lines = response.split("\n");
  lines.shift();
 
  functiontype.length = 0;
  material.length = 0;
  colors.length = 0;
  if (lines.length <= 1) {

    document.getElementById(div).innerHTML += '<h1>There are no results</h1>';
  } else {
    var $demo = $('#demo');
    var items = [];
    var linesPlus = [];
    $("#display-products").empty();
    for (i = 0; i < lines.length - 1; i++) {
      linesPlus.push(lines[i].split("|"));
    }

    for (i = 0; i < linesPlus.length; i++) {
      var flds = linesPlus[i];
      if ( banned.indexOf(flds[0].trim()) != -1 ) { continue; } 
      stringOfDetails = flds[0].trim() + '+' + flds[8].trim() + '+' + flds[9].trim() + '+' + flds[10].trim();
      prod =  '<li class="hope ' + flds[2].trim() + " " + flds[8].trim() + " " + flds[9].trim() + " " + flds[10].trim() + 1 + '"><div class="product"><figure class="product-image-area"><a href="#product-details+' + stringOfDetails + '" title="' + flds[1] + '" class="product-image"><img src="https://www.primaDIY.com/productimages/' + flds[0].trim() + '-md.jpg" alt="' + flds[1] + '"></a>';
      //prod =  '<li class="hope ' + flds[2].trim() + " " + flds[8].trim() + " " + flds[9].trim() + " " + flds[10].trim() + 1 + '"><div class="product"><figure class="product-image-area"><a href="#product-details+' + stringOfDetails + '" title="' + flds[1] + '" class="product-image"><img src="../img/demos/shop/products/product2.jpg" alt="' + flds[1] + '"></a>';
      prod += '</figure><div class="product-details-area"><h2 class="product-name"><a href="#product-details+' + stringOfDetails + '" title="' + flds[1] + '">' + flds[1] + '</a></h2><p class="title" style="">' + flds[0] + '</p><p class="desc" style="display: none;">' + flds[2].trim() + '</p><p class="themes" style="display: none;"><span class="' + flds[8].trim() + '">' + flds[8].trim() + '</span></p><p class="materials" style="display: none;"><span class="' + flds[10].trim() + 1+'">' + flds[10].trim() + 1+ '</span></p>';
      prod += '<div class="product-price-box"><span class="product-price">$' + flds[3] + '</span></div><div class="product-actions"><a href="#" class="addtocart" title="Add to Cart" onclick="stock_no=\'' + flds[0].trim() + '\'; detailString=\'#detail-view+' + stringOfDetails + '\'; addItemDetailView(); cart(); showAlert(); event.preventDefault();"><i class="fa fa-shopping-cart"></i><span>Add to Cart</span></a></div></div></div></li>';

      items.push($(prod));
     
      listOfAttributes(functiontype, flds[9]);
      listOfAttributes(material, flds[10]);
      listOfAttributes(colors, flds[8]);
    }
   
    $demo.jplist({
      itemsBox: '#display-products',
      itemPath: '.hope',
      panelPath: '.jplist-panel'
    });
    $demo.jplist({
      command: 'add',
      commandData: {
        $items: items
      }
    });
  }
  $("#panel-filter-type, #panel-filter-material, #color-panel").empty();
  fillTypeField();
}


/////////////////////////////////////
// SUBROUTINE TO FIND TYPE //
/////////////////////////////////////
function whatType(typeCode) {
  switch (typeCode) {
    case "100":
      type = "Necklace";
      break;
    case "200":
      type = "Bracelet";
      break;
    case "300":
      type = "Earrings";
      break;
    case "400":
      type = "Lanyard";
      break;
    case "500":
      type = "Snap";
      break;
    case "600":
      type = "Tassel";
      break;
    case "700":
      type = "Set";
      break;
    case "800":
      type = "Program";
      break;
    case "850":
      type = "Display";
      break;
    case "900":
      type = "Oil";
      break;
    case "950":
      type = "Accessory";
      break;
    case "1000":
      type = "Scarf";
      break;
    case "1100":
      type = "Pendant";
      break;
    case "1200":
      type = "Purse";
      break;
    case "1300":
      type = "Wristlet";
      break;
    case "1400":
      type = "Brooch";
      break;
    case "1500":
      type = "Ring";
      break;
    case "1600":
      type = "Versatile";
      break;
    case "1700":
      type = "Beads";
      break;
    case "1800":
      type = "Seed Beads";
      break;
    case "1900":
      type = "Bead Strands";
      break;
    case "2000":
      type = "Bead Caps";
      break;
    case "2100":
      type = "Slide Beads";
      break;
    case "2200":
      type = "Crimp Beads";
      break;
    case "2300":
      type = "Flatback Rhinestones";
      break;
    case "2400":
      type = "Charms";
      break;
    case "2500":
      type = "Crystals";
      break;
    case "2600":
      type = "Pearls";
      break;
    case "2700":
      type = "Gemstones";
      break;
    case "2800":
      type = "Transfers";
      break;
    case "3000":
      type = "Clasps";
      break;
    case "3100":
      type = "Jump Rings";
      break;
    case "3200":
      type = "Split Rings";
      break;
    case "3300":
      type = "Head Pins";
      break;
    case "3400":
      type = "Eye Pins";
      break;
    case "3500":
      type = "Bails";
      break;
    case "3600":
      type = "Crimp Tubes";
      break;
    case "3700":
      type = "Connectors";
      break;
    case "3800":
      type = "Spacer Beads";
      break;
    case "3900":
      type = "Cord Endings";
      break;
    case "4000":
      type = "Earring Findings";
      break;
    case "4100":
      type = "Cord";
      break;
    case "4200":
      type = "Wire";
      break;
    case "4300":
      type = "Thread";
      break;
    case "4400":
      type = "Jewelry Kits";
      break;
    case "4500":
      type = "PLiers";
      break;
    case "4600":
      type = "Cutters";
      break;
    case "4700":
      type = "Tool Kits";
      break;
    case "4800":
      type = "Cloths";
      break;
    case "4900":
      type = "Organizers";
      break;
    case "5000":
      type = "Heat Set Tools";
      break;
    case "5100":
      type = "Adhesives";
      break;
    case "5200":
      type = "Screwdrivers";
      break;
    case "5300":
      type = "Bead Looms";
      break;
    case "5400":
      type = "Hammer";
      break;
    case "5500":
      type = "Needles";
      break;
    case "5600":
      type = "Tweezers";
      break;
    case "5700":
      type = "Glue Gun";
      break;
    case "5800":
      type = "Gift Packaging";
      break;
    case "5900":
      type = "Plastic Bags";
      break;
    case "6000":
      type = "Specialty";
      break;
    case "6100":
      type = "Hot Fix Rhinestones";
      break;
    case "6200":
      type = "Beading Thread";
      break;
    case "6300":
      type = "Embroidery Thread";
      break;
    case "6400":
      type = "Beading Wire";
      break;
    case "6500":
      type = "Misc Tools";
      break;
    case "6600":
      type = "Stretch Cord";
      break;
    case "6700":
      type = "Satin Cord";
      break;
    case "6800":
      type = "Bicones";
      break;
    case "6900":
      type = "Pony Beads";
      break;
    case "7000":
      type = "Rondelles";
      break;
    default:
      type = "N/A";
  }
  return type;
}


/////////////////////////////////////
// SUBROUTINE TO FIND METAL TYPE //
/////////////////////////////////////
function whatMetal(metalCode) {
  switch (metalCode) {
    case "10":
      metal = "Gold Plated";
      break;
    case "20":
      metal = "Silver Plated";
      break;
    case "30":
      metal = "Antique Gold Plated";
      break;
    case "40":
      metal = "Gunmetal";
      break;
    case "50":
      metal = "Stainless Steel";
      break;
    case "60":
      metal = "Acrylic";
      break;
    case "70":
      metal = "Wood";
      break;
    case "80":
      metal = "Plastic";
      break;
    case "90":
      metal = "Nylon";
      break;
    case "100":
      metal = "Suede";
      break;
    case "110":
      metal = "Leather";
      break;
    case "120":
      metal = "Yarn";
      break;
    case "130":
      metal = "Satin";
      break;
    case "140":
      metal = "Lace";
      break;
    case "150":
      metal = "Cotton";
      break;
    case "160":
      metal = "Faux Leather";
      break;
    case "170":
      metal = "Faux Suede";
      break;
    case "180":
      metal = "Hemp";
      break;
    case "190":
      metal = "Jute / Twine";
      break;
    case "200":
      metal = "Porcelain";
      break;
    case "210":
      metal = "Base Metal";
      break;
    case "220":
      metal = "Sterling Silver";
      break;
    case "230":
      metal = "Rose Gold Plated";
      break;
    case "240":
      metal = "Glass";
      break;
    case "250":
      metal = "Platinum Plated";
      break;
    case "260":
      metal = "Copper";
      break;
    case "270":
      metal = "Silk";
      break;
    case "280":
      metal = "Crystal";
      break;
    default:
      metal = "N/A";
  }
  return metal;
}



//////////////////////////////////////////////
  // Filter the Products on the Shop Page //
//////////////////////////////////////////////

/*
function priceFilter() {
  var priceRangefrom = ( isNaN(parseFloat($("#min").val())) ? 1 : parseFloat($("#min").val()) );
  var priceRangeto   = ( isNaN(parseFloat($("#max").val())) ? 9999 : parseFloat($("#max").val()) );
  $('.ui-group').trigger( 'change');
  $container.isotope({
    transitionDuration: '0.65s',
    filter: function() {

      if( jQuery(this).is(':visible')) {
        if( jQuery(this).find('.product-price').find('ins').length > 0 ) {
          price = jQuery(this).find('.product-price ins').text();
        } else {
          price = jQuery(this).find('.product-price').text();
        }
        priceNum = price.split("$");
        return ( priceRangefrom <= priceNum[1] && priceRangeto >= priceNum[1] );
      }
    }
  });
}


var $container = $('#display-products');

$container.isotope();
// do stuff when checkbox change
$('.filterbutton').on( 'change', function( event ) {
 // $container.isotope('destroy');
  var checkbox = event.target;

  var $checkbox = $( checkbox );
  var group = $checkbox.parents('.filterbutton').attr('data-group');

  // create array for filter group, if not there yet
  var filterGroup = filters[ group ];
  if ( !filterGroup ) {
    filterGroup = filters[ group ] = [];
  }
  // add/remove filter
  if ( checkbox.checked ) {
    // add filter
    filterGroup.push( checkbox.value );
  } else {
    // remove filter
    var index = filterGroup.indexOf( checkbox.value );
    filterGroup.splice( index, 1 );
  }
  
  var comboFilter = getComboFilter();

  $container.isotope({ filter: comboFilter });
});


function getComboFilter() {
  var combo = [];
  for ( var prop in filters ) {
    var group = filters[ prop ];
    if ( !group.length ) {
      // no filters in group, carry on
      continue;
    }
    // add first group
    if ( !combo.length ) {
      combo = group.slice(0);
      continue;
    }
    // add additional groups
    var nextCombo = [];
    // split group into combo: [ A, B ] & [ 1, 2 ] => [ A1, A2, B1, B2 ]
    for ( var i=0; i < combo.length; i++ ) {
      for ( var j=0; j < group.length; j++ ) {
        var itemForCombo = combo[i] + group[j];
        nextCombo.push( itemForCombo );
      }
    }
    combo = nextCombo;
  }
  var comboFilter = combo.join(', ');

  return comboFilter;
}
*/