//var session_no = "E9DZRD9OM9GRZZEOTGLOED411";
var freeShip = false;
//var username = "ACEWORKS";
var functiontype = [];
var colors = [];
var material = [];
var colorDictionary = [
    [""],["Silver", "#c0c0c0"],["Gold", "#ffd700"],["Black", "#000000"],["Blue", "#0000ff"],["Brown", "#A52A2A"],
    ["Clear", "rgba(255,255,255,0)"],["Green", "#00ff00"],["Grey", "#808080"],["Opal", "#a9c6c2"],["Orange", "#FFA500"],
    ["Pink", "#FFC0CB"],["Purple", "#800080"],["Rainbow", "linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))"],
    ["Red", "#FF0000"],["Tan", "#D2B48C"],["Teal", "#008080"],["Turquoise", "#40E0D0"],["White", "#fff"],["Yellow", "#ffff00"],
    ["Multi", "repeating-linear-gradient(red, yellow 10%, green 20%);"],["Copper", "#b87333"],["Rose Gold", "#b76e79"],["Antique Gold", "#D4AF37"],["Gunmetal", "#2c3539"]];
var session_no;




/////////////////////////////////////////
// create new customer //
/////////////////////////////////////////

function createCustomer() {
  var createcompanyname = $("#create-contactname").val();
  var createcontactname = $("#create-contactname").val();
  var createaddress1 = "";
  var createaddress2 = "";
  var createaddress3 = "";
  var createcity = $("#create-city").val();
  var createstate = $("#create-state").val();
  var createzipcode = $("#create-zipcode").val();
  // var createcountry     = $("#create-country").val();
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
      } else {
        var newCustomerNumber = response;
        $("#newCustomer").hide();
        $("#newUser").show();
        document.getElementById("create-user-number").value = newCustomerNumber.trim();
        document.getElementById("create-user-email").value = createemail.trim();
        document.getElementById("create-user-contactname").value = createcompanyname.trim();
      }
    }
  });
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
            alert("Laura Janelle user has been created. Double check SouthWare and make sure everything was entered correctly.");
            $.get("https://netlink.laurajanelle.com:444/mailer/prima_logincred.php?username=" + newUserName + "&email=" + userEmail + "&password=" + userPassword + "&name=" + userContactName + "");
          } else {
            alert("User not created, try again.");
          }
        },
        complete: function () {
          windowHash("products");
          redirect("store");
        }
      });
    }
  });
}



////////////////////////////////////////
/// LOGIN INTO THE STORE AND VERIFY  ///
////////////////////////////////////////
function login() {
  if (localStorage.getItem('session_no') && typeof (localStorage.getItem('session_no')) === "string" && localStorage.getItem('session_no').length === 25) {
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


      // ADD the HTTPS back in when the SSL Cert becomes available again....
      success: function (response) {
        if (response.replace(/\s+/g, '').length === 25) {
          $.get("http://www.primadiy.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "", function (answer) {
            if (answer === "0") {
              $.get("http://www.primadiy.com/phphelper/savecart/session.php?customer=" + username.toLowerCase() + "&sessid=" + response + "");
              session_no = response.replace(/\s+/g, '');
              localStorage.setItem('session_no', session_no);
            } else {
              localStorage.setItem('session_no', answer);
            }
            localStorage.setItem('username', username);
          }).done(function () {
            windowHash("products");
            redirect("store");
          });
        } else {
          alert("Login credentials are incorrect, try again.");
        }
      }
    });
  });
}




/////////////////////////////////////////////////////
// Get Session Number and Authorize Access to Page //
/////////////////////////////////////////////////////
function sessionNumber()
{
  session_no = localStorage.getItem('session_no');
  if (typeof(session_no) === "undefined" || session_no.length !== 25) {
    pathArray = window.location.pathname.split( '/' );
    pathArray[pathArray.length - 2] = "login";
    window.location.pathname = pathArray.join('/');
    alert("Please log in first.");
  }
}

////////////////////////////
// To Populate Shop Page  //
////////////////////////////
function fillShop()
{
  var params;
  if (localStorage.getItem('shopParams')) {
    params = localStorage.getItem('shopParams').split(",");
    return filterFunction2('APISTKLST',params[0],params[1],params[2],params[3],params[4],'E9DZRD9OM9GRZZEOTGLOED411','800');
  } else {
    localStorage.setItem('shopParams', ['80010000','','','','']);
    fillShop();
  } 
}


//////////////////////////
// Filter Function      //
//////////////////////////
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

      stringOfDetails = flds[0].trim() + '+' + flds[8].trim() + '+' + flds[9].trim() + '+' + flds[10].trim();
      prod =  '<li class="hope ' + flds[2].trim() + " " + flds[8].trim() + " " + flds[9].trim() + " " + flds[10].trim() + 1 + '"><div class="product"><figure class="product-image-area"><a href="#product-details+' + stringOfDetails + '" title="' + flds[1] + '" class="product-image"><img src="https://www.laurajanelle.com/ljjpgimages/' + flds[0].trim() + '-md.jpg" alt="' + flds[1] + '"></a>';
      prod += '<a href="#" class="product-quickview"><i class="fa fa-share-square-o"></i><span>Quick View</span></a></figure><div class="product-details-area"><h2 class="product-name"><a href="#product-details+' + stringOfDetails + '" title="' + flds[1] + '">' + flds[1] + '</a></h2><p class="title" style="">' + flds[1] + '</p><p class="desc" style="">' + flds[2].trim() + '</p><p class="themes" style=""><span class="' + flds[8].trim() + '">' + flds[8].trim() + '</span></p><p class="materials" style=""><span class="' + flds[10].trim() + 1+'">' + flds[10].trim() + 1+ '</span></p>';
      prod += '<div class="product-price-box"><span class="product-price">$' + flds[4] + '</span></div><div class="product-actions"><a href="#" class="addtocart" title="Add to Cart" onclick="stock_no=\'' + flds[0].trim() + '\'; detailString=\'#detail-view+' + stringOfDetails + '\'; addItemDetailView(); cart(); showAlert(); event.preventDefault();"><i class="fa fa-shopping-cart"></i><span>Add to Cart</span></a></div></div></div></li>';

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

function fillTypeField() 
{
  functiontype.forEach(function (element) {
    $('#panel-filter-type').append('<li><a href="#" onclick="$(\'#'+ element +'\').click();">'+ whatType(element) +'</a></li>');
  });

  material = material.filter(function(n){ return n !== ""; });
  material.forEach(function (element) {
    $('#panel-filter-material').append('<li><a href="#">'+ whatMetal(element) +'</a></li>');
  });

  colors = colors.filter(function(n){ return n !== ""; });
  colors.forEach(function (element) {
    $('#color-panel').append('<li><a href="#"><span data-plugin-tooltip data-toggle="tooltip" data-placement="top" title="'+ colorDictionary[element][0] +'" style="background: '+ colorDictionary[element][1] +'" onclick="$(\'#'+ element +'\').click();"><div class="checkbox-custom checkbox-'+ colorDictionary[element][0] +'"><input type="checkbox" checked=""></div></span></a></li>');
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
//////////////////////////////    /#detail-view+11956+20+100+30
function detailView(callback, callback2) {
  jQuery("#productGalleryThumbs").empty();
  jQuery("a.detailadd").remove();

  var picsGallery = "";
  var picArray = ["", "-pk", "-rl"];
  var dets;
  var secondColumn;
  var detailString;
  var color;
  var type;
  var metal;
  var rate = true;
  var secondImage;
  var hash = window.location.hash.split("+");
  var stock_no = hash[1];
  // var productRating = [];


  // switch around the if later for faster rendering?
  if (hash[3] !== "" && hash.length === 5) {
    detailString = window.location.hash;
    color = hash[2];
    type = hash[3];
    metal = hash[4];
    localStorage.setItem(stock_no, detailString);
  } else if (localStorage.getItem(stock_no) !== null && localStorage.getItem(stock_no) != "undefined" && localStorage.getItem(stock_no).length >= 15) { //  add back if undefined ever comes up again
    dets = localStorage.getItem(stock_no).split("+");
    color = dets[2];
    type = dets[3];
    metal = dets[4];
  }

  $.ajax({
    type: "GET",
    url: "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?",
    data: {
      request_id: "APISTKDTL",
      stock_no: stock_no,
      session_no: "1ZOT4DGMB1OFTRD9RGDERD13O"
    },
    success: function (response) {
      lines = response.split("\n");
      fields = lines[1].split("|");

      /* Fill in the pictures for the product */
      //  $("div.product-img-wrapper").html('<img id="product-zoom" src="https://www.laurajanelle.com/ljjpgimages/' + fields[0] + '-lg.jpg" data-zoom-image="https://www.laurajanelle.com/ljjpgimages/' + fields[0] + '-lg.jpg" alt="'+ fields[1] +'">');
      $("#product-zoom").attr({
        src: "https://www.laurajanelle.com/ljjpgimages/" + fields[0] + "-lg.jpg",
        "data-zoom-image": "https://www.laurajanelle.com/ljjpgimages/" + fields[0] + "-lg.jpg",
        alt: fields[1]
      });

      picArray.forEach(function (element) {
        picsGallery += '<div class="product-img-wrapper"><a href="#" data-image="../img/demos/shop/products/single/product1.jpg" data-zoom-image="../img/demos/shop/products/single/product1.jpg" class="product-gallery-item"><img src="../img/demos/shop/products/single/thumbs/product1.jpg" alt="product"></a></div>';
      });

      $(".itemName").text(fields[1]);
      // add in custom ratings
      if (rate) {
        $("div.rating").width(Math.floor(Math.random() * 101) + '%');
        $("span.count").text("2");
      } else {
        $(".product-ratings").remove();
        $(".review-link-in").remove();
      }

      if (fields[8] && fields[8].length !== 0) {
        $(".product-short-desc p").html(fields[8]);
      } else {
        $(".product-short-desc p").html(fields[1]);
      }

      $("span.product-price").text('$' + fields[4]);

      if (fields[5] && fields[5] > 0) {
        $("p.availability").html('<span class="font-weight-semibold">Availability:</span> In Stock</p></div>');
      } else {
        $("p.availability").html('<span class="font-weight-semibold">Availability:</span> Out of Stock</p></div>');
      }

      $(".product-detail-qty").after('<a href="#" class="addtocart detailadd" title="Add to Cart" onclick="stock_no=\'' + fields[0].trim() + '\'; addItemDetailView(); return false;"><i class="fa fa-shopping-cart"></i><span>Add to Cart</span></a>');

      addInfo = '<tr><td class="table-label">Description</td><td>' + fields[1] + '</td></tr>';
      addInfo += '<tr><td class="table-label">Dimensions</td><td>' + fields[6] + '</td></tr>';
      addInfo += '<tr><td class="table-label">Color</td><td>' + whatColor(color) + '</td></tr>';
      addInfo += '<tr><td class="table-label">Type</td><td>' + whatType(type) + '</td></tr>';
      addInfo += '<tr><td class="table-label">Look</td><td>' + whatLook(fields[2]) + '</td></tr>';
      addInfo += '<tr><td class="table-label">Metal Color</td><td>' + whatMetal(metal) + '</td></tr>';

      //$("#images").html(pic);
      $("#productGalleryThumbs").html(picsGallery);
      $("table.product-table tbody").html(addInfo);
      $('.owl-carousel').owlCarousel('destroy');
      $('.owl-carousel').owlCarousel('refresh');
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



////////////////////////////////////////
/// SUBROUTINE- Add item to the cart ///
////////////////////////////////////////
function addItemGeneric(session_no, stock_no, qty) {
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

  // Save color and type in the 
  if (!localStorage.getItem(stock_no) || localStorage.getItem(stock_no) === "undefined" || localStorage.getItem(stock_no) === null) {
    localStorage.setItem(stock_no, detailString);
  }

  addItemGeneric(session_no, stock_no, detailViewQty);

  if (window.location.hash !== "#products") {
    window.location.hash = "cart";
    console.log("hello I ran");
  }
  return false;
}



/////////////////////////////////////////
// SUBROUTINE - REMOVE ITEMS FROM CART //
/////////////////////////////////////////
function removeItem(session_no, line_no) {
  $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTREM&session_no=" + session_no + "&line_no=" + line_no + "");
  cart();
  return false;
}


////////////////////////////////////////
// SUBROUTINE - DELETE THE WHOLE CART //
////////////////////////////////////////
function deleteCart() {
  if (confirm("Are you sure?") === true) {
    $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTDEL&session_no=" + session_no + "");
    cart();
  }
}


////////////////////////\\
// Update Cart Function \\
//\\\\\\\\\\\\\\\\\\\\\\\\
function updateCart() {
  $("#updateCartButton").hide();
  var shoppingCart = {};
  var table = $("table.cart-table tbody");

  // loop thru cart and flatten the items that are repeated
  table.find('tr').each(function () {
    var line_no = $(this).find('td.product-action-td a').attr('id');
    var stockNumber = $(this).find('td.product-image-td a').attr('title');
    var qty = parseInt($(this).find('td:nth-child(5) div input:nth-child(2)').val());

    removeItem(session_no, line_no);

    if (!shoppingCart.hasOwnProperty(stockNumber)) {
      shoppingCart[stockNumber] = [qty, line_no];
    } else {
      shoppingCart[stockNumber][0] += qty;
      removeItem(session_no, shoppingCart[stockNumber][1]);
    }

  });
  $.each(shoppingCart, function (key, value) {
    addItemGeneric(session_no, key, value[0]);
  });
  cart();
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
      cartheader = response.split("\n");
      if (cartheader.length >= 3) {
        cartHeaderFields = cartheader[1].split("|");
        $(".cart-qty").text(cartHeaderFields[24].trim());
        $(".cart-totals span").text('$' + cartHeaderFields[19].trim());

        if (window.location.hash === "#cart") {
          $("table.totals-table tbody").html('<tr><td>Subtotal</td><td>$' + cartHeaderFields[19].trim() + '</td></tr><tr><td>Grand Total</td><td>$' + cartHeaderFields[22].trim() + '</td></tr>');
          //Add the shipping cost. Depending on the Grand Total.
          if (parseInt(cartHeaderFields[22]) > 25) {
            freeShip = true;
            $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&misc_amt1=0.00");
          } else {
            freeShip = false;
            $.get("https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICARTUPD&session_no=" + session_no + "&misc_amt1=5.00");
          }
        }
        if (window.location.hash === "#checkout") {
          $(".showTotal").html('$' + cartHeaderFields[22].trim());
          console.log(cartHeaderFields[28]);
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

          if (parseInt(cartHeaderFields[22]) > 25) {
            freeShip = true;
            $("#freeShip").html('<input type="radio" value="shipping-method-1" name="shipping[method]" checked="checked"> Free Shipping');
          } else {
            freeShip = false;
            $("#freeShip").html('<input type="radio" value="shipping-method-2" name="shipping[method]" checked="checked">Fixed <span class="text-primary">$5.00</span>');
          }
        }
        if (window.location.hash === "#dashboard") {
          $("#default-billing-address").html(cartHeaderFields[3].trim() + ' ' + cartHeaderFields[4].trim() + ' ' + cartHeaderFields[5].trim() + '<br>' + cartHeaderFields[6].trim() + ', ' + cartHeaderFields[7] + ' ' + cartHeaderFields[8].trim());
          $("#default-shipping-address").html(cartHeaderFields[10].trim() + ' ' + cartHeaderFields[11].trim() + ' ' + cartHeaderFields[12].trim() + '<br>' + cartHeaderFields[13].trim() + ', ' + cartHeaderFields[14] + ' ' + cartHeaderFields[15].trim() + '<br><a href="#">Add Address</a>');
        }
      }
    },
    complete: function () {
      if (callback && typeof (callback) === "function") {
        callback();
      }

    }
  });
  return false;
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

      jQuery(".cart-products").empty();
      html = [];
      html2 = [];

      if (window.location.hash === "#cart") {
        $("table.cart-table tbody").empty();
        cartHelper();
        $("table.cart-table tbody").prepend(html.join(''));
      } else if (window.location.hash === "#checkout") {
        $("table#reviewItemTable tbody").empty();
        cartHelper();
      } else {
        cartHelper();
      }
    }
  });
  return false;
}

/////////////////////////////////////////////
// SUBROUTINE - CONSTRUCTING THE CART LIST //
/////////////////////////////////////////////
function cartHelper() {
  if (cartitems.length > 2) {
    for (i = 1; i < cartitems.length - 1; i++) {
      data = cartitems[i].split("|");
      miniitem = '<div class="product product-sm"><a href="#" onclick="removeItem(\'' + session_no + '\', \'' + data[1].replace(/\s+/g, '') + '\'); return false;" class="btn-remove" title="Remove Product"><i class="fa fa-times"></i></a>';
      miniitem += '<figure class="product-image-area"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="Product Name" class="product-image"><img src="https://www.laurajanelle.com/ljjpgimages/' + data[2].replace(/\s+/g, '') + '-sm.jpg" alt="Product Name"></a></figure>';
      miniitem += '<div class="product-details-area"><h2 class="product-name"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="Product Name">' + data[3] + '</a></h2><div class="cart-qty-price">' + data[6].replace(/\s+/g, '') + ' X <span class="product-price">$' + data[7].substring(0, data[7].length - 3).trim() + '</span></div></div></div>';

      html2.push(miniitem);

      if (window.location.hash === "#cart") {
        listitem = '<tr><td class="product-action-td"><a href="#" title="Remove product" class="btn-remove" onclick="removeItem(\'' + session_no + '\', \'' + data[1].replace(/\s+/g, '') + '\'); return false;" id="' + data[1].replace(/\s+/g, '') + '"><i class="fa fa-times"></i></a></td>';
        listitem += '<td class="product-image-td"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="' + data[2].replace(/\s+/g, '') + '"><img src="https://www.laurajanelle.com/ljjpgimages/' + data[2].replace(/\s+/g, '') + '-sm.jpg" alt="' + data[3] + '"></a></td>';
        listitem += '<td class="product-name-td"><h2 class="product-name"><a href="#product-details+' + data[2].replace(/\s+/g, '') + '" title="Product Name">' + data[3] + '</a></h2></td><td>$' + data[7].substring(0, data[7].length - 3) + '</td><td><div class="qty-holder">';
        listitem += '<input type="button" class="qty-dec-btn" title="Dec" value="-" data-type="minus" data-field="quant[' + i + ']" onclick="changeQuantity(this);" />';
        listitem += '<input type="text" class="qty-input" name="quant[' + i + ']" min="1" value="' + data[6].replace(/\s+/g, '') + '" id="' + data[2].replace(/\s+/g, '') + '" />';
        listitem += '<input type="button" class="qty-inc-btn" title="Inc" value="+" data-type="plus" data-field="quant[' + i + ']" onclick="changeQuantity(this);" />';
        listitem += '<a href="#" class="edit-qty"><i class="fa fa-pencil"></i></a></div></td><td><span class="text-primary">$' + data[8].substring(0, data[8].length - 4) + '</span></td></tr>';

        html.push(listitem);
        // $("#updateCartButton").show();
      } else if (window.location.hash === "#checkout") {
        $("table#reviewItemTable tbody").append('<tr><td>' + data[3] + '</td><td class="text-center">' + data[6].replace(/\s+/g, '') + '</td><td class="text-right">$' + data[8].substring(0, data[8].length - 4) + '</td></tr>');
      }
    }
  } else {
    item = '<tr class="cart_item products"><td class="cart-product-remove"><h1> Cart is empty</h1></td></tr>';
    html.push(item);
  }
  $("div.cart-products").append(html2.join(''));
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
        message += '<p>This is a confirmation that your order has been successfully received and is currently under process. You will receive an email soon with a copy of your invoice, which also includes the details of your order.</p>';
        message += '<p class="nobottommargin">Primabead values your business and is continuously looking for ways to better satisfy their customers. Please share with us if there is a way we can serve you better.</p>';

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


/////////////////////////////////////
// SUBROUTINE TO FIND COLOR //
/////////////////////////////////////
function whatColor(colorCode) {
  switch (colorCode) {
    case "1":
      color = ["Silver"];
      break;
    case "2":
      color = ["Gold"];
      break;
    case "3":
      color = ["Black", "#000"];
      break;
    case "4":
      color = ["Blue"];
      break;
    case "5":
      color = ["Brown"];
      break;
    case "6":
      color = ["Clear"];
      break;
    case "7":
      color = ["Green"];
      break;
    case "8":
      color = ["Grey"];
      break;
    case "9":
      color = "Opal";
      break;
    case "10":
      color = "Orange";
      break;
    case "11":
      color = "Pink";
      break;
    case "12":
      color = "Purple";
      break;
    case "13":
      color = "Rainbow";
      break;
    case "14":
      color = "Red";
      break;
    case "15":
      color = "Tan";
      break;
    case "16":
      color = "Teal";
      break;
    case "17":
      color = "Turquoise";
      break;
    case "18":
      color = "White";
      break;
    case "19":
      color = "Yellow";
      break;
    case "20":
      color = "Mulitcolored";
      break;
    default:
      color = "N/A";
  }
  return color;
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
    default:
      type = "N/A";
  }
  return type;
}
/////////////////////////////////////
// SUBROUTINE TO FIND LOOK //
/////////////////////////////////////
function whatLook(lookCode) {
  switch (lookCode) {
    case "SLK":
      look = "SLEEK";
      break;
    case "ENC":
      look = "enCHARMing";
      break;
    case "GLB":
      look = "RGLB";
      break;
    case "IDT":
      look = "iDentify";
      break;
    case "ZEN":
      look = "AURA";
      break;
    case "SRK":
      look = "Salt Rock";
      break;
    case "MAN":
      look = "MANTRA";
      break;
    case "TRS":
      look = "Natural Treasures";
      break;
    case "TEM":
      look = "TEAM SPIRIT!";
      break;
    default:
      look = "N/A";
  }
  return look;
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
      metal = "Antique Gold";
      break;
    case "40":
      metal = "Gunmetal";
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
  console.log(comboFilter);
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


function currentAsideLink(hash) {
  $('ul.nav.nav-list li.' + hash + '-link').addClass("active");
}

function cart() {
  cartHeader();
  cartList();
}

function checkoutPage() {
  //employeeDiscount();
  //session_no = localStorage.getItem('session_no');
  billingAddresses = [];
  shippingAddresses = [];
  $("#creditcard").hide();

  $("#billing-address, #shipping-address").empty();
  fillAddresses();

  document.getElementById("creditcard").src = "https://netlink.laurajanelle.com:444/nlhtml/custom/netlink.php?request_id=APICC&session_no=" + session_no + "";

  $("#myButton").click(function (e) {
    $("#billingForm, #shippingForm").validate();
    var isBillValid = $("#billingForm").valid();
    var isShipValid = $("#shippingForm").valid();
    if (!isBillValid || !isShipValid) {
      e.preventDefault();
      alert("Address forms have errors");
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
  $('div.store-page').hide();
  switch (locale) {
    case '#products':
      $('#products').show();
      break;
    case '#product-details':
      $('#product-details').show();
      window.scrollTo(0, 0);
      detailView(); //detailView(getQuestions, getReviews);
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
      //username = localStorage.getItem('username').toUpperCase();
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
    case '#search':
      window.scrollTo(0, 0);
      $('#search').show();
      break;
    default:
      window.scrollTo(0, 0);
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
function sessionNumber() {
  session_no = localStorage.getItem('session_no');
  if (typeof (session_no) === "undefined" || session_no.length !== 25) {
    pathArray = window.location.pathname.split('/');
    pathArray[pathArray.length - 2] = "retailerlogin";
    window.location.pathname = pathArray.join('/');
    alert("Please log in first.");
  }
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
  if (!freeShip) {
    shippingPrice = 5.00;
  } else {
    shippingPrice = 0.00;
  }

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
      text5: text5,
      misc_amt1: shippingPrice
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


////////////////////////////////
// Find Minimum for the order //
////////////////////////////////
function employeeDiscount() {
  username = localStorage.getItem("username");
  usernameSplit = username.split("");
  employee = usernameSplit.slice(0, 3).join("");
}

function minimumTotal() {
  newCustomer = localStorage.getItem('newCustomer');
  orderAmt = cartHeaderFields[22].trim();
  orderAmtFloat = parseFloat(orderAmt.replace(/,/g, ''));

  if ((newCustomer === "false" && orderAmtFloat < 100 || newCustomer === "true" && orderAmtFloat < 200) && employee !== "CCA") {
    $("#myButton").hide();
    if (newCustomer === "true") {
      document.getElementById("minimumTotalWarning").innerHTML += '<h2>You need spend $' + parseFloat((200 - orderAmtFloat)).toFixed(2) + ' more to reach the minimum order requirement of $200 for new customers.</h2>';
    }
    if (newCustomer === "false") {
      document.getElementById("minimumTotalWarning").innerHTML += '<h2>You need spend $' + parseFloat((100 - orderAmtFloat)).toFixed(2) + ' more to reach the minimum order requirement of $100.</h2>';
    }
  } else {
    // if ( hideCC === true) {
    //   $("#myButton").show();
    // }
  }
}

bootstrap_alert = function () {};
bootstrap_alert.warning = function (message, alert, timeout) {
  $('<div id="floating_alert" class="alert alert-' + alert + ' fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' + message + '&nbsp;&nbsp;</div>').appendTo('body');
  setTimeout(function () {
    $(".alert").alert('close');
  }, timeout);
};

function showAlert() {
  bootstrap_alert.warning('Item has been added to your cart.', 'success', 4000);
  // available: success, info, warning, danger

}

/*
		<script>
			$().ready(function () {
        $("#billingForm, #shippingForm").validate();
        var isBillValid = $("#billingForm").valid();
        var isShipValid = $("#shippingForm").valid();
        if (!isBIllValid || !isShipValid) {
            e.preventDefault();
            alert("Address forms have errors");
        } else {

        }
			});
		</script>
*/