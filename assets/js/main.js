var fullNameInput = document.getElementById("fullName"); // input kolo
var phoneNumberInput = document.getElementById("phoneNumber");
var emailAddressInput = document.getElementById("emailAddress");
var addressInput = document.getElementById("address");
var groupSelectInput = document.getElementById("group");
var notesInput = document.getElementById("notes");
var favoriteInput = document.getElementById("favorite");
var emergencyInput = document.getElementById("emergency");

var contactImgInput = document.getElementById("contactImg");
var previewImg = document.getElementById("previewImg");
var previewIcon = document.getElementById("previewIcon");

var totalContactsInput = document.getElementById("totalContacts");
var favoriteContactsInput = document.getElementById("favoriteContacts");
var emergencyContactsInput = document.getElementById("emergencyContacts");
var searchInput = document.getElementById("search");

var saveBtnInput = document.getElementById("saveBtn");
var updateBtnInput = document.getElementById("updateBtn");

var contactList = [];

if (localStorage.getItem("contactList")) {
  contactList = JSON.parse(localStorage.getItem("contactList"));
}

displayContact(contactList);

// *function to add contact to contactList array*
function addContact() {
  // validate full name
  // لو الشرط ده متحققش يعني الاسم اللي دخله المستخدم مش صح هتظهر رسالة خطأ و هتوقف تنفيذ الفانكشن عند return
  if (!validateInput(fullNameInput, contactRegex.nameRegex, "fullNameError")) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });

    return;
  }

  // validate phone
  if (
    !validateInput(
      phoneNumberInput,
      contactRegex.phoneNumberRegex,
      "phoneError",
    )
  ) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
    });

    return;
  }

  // validate email
  if (
    !validateInput(emailAddressInput, contactRegex.emailRegex, "emailError")
  ) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address",
    });

    return;
  }

  // create contact object
  var contact = {
    // image: `./imgs/${contactImgInput.files[0].name}`,
    image: contactImgInput.files[0]
      ? `./imgs/${contactImgInput.files[0].name}`
      : "",

    fullName: fullNameInput.value,
    phoneNumber: phoneNumberInput.value,
    emailAddress: emailAddressInput.value,
    address: addressInput.value,
    group: groupSelectInput.value,
    notes: notesInput.value,
    favorite: favoriteInput.checked,
    emergency: emergencyInput.checked,
  };

  // add contact
  contactList.push(contact);

  // save to localStorage
  localStorage.setItem("contactList", JSON.stringify(contactList));

  // display contacts that in original array(contactList) after adding new contact by calling
  displayContact(contactList);

  // reset inputs
  resetAllInputs();

  // success alert
  Swal.fire({
    title: "Added!",
    text: "Contact has been added successfully!",
    icon: "success",
    showConfirmButton: false,
    timer: 2000,
  });

  // hide modal after adding contact
  //  bootstrap.Modal.getInstance return object so i store it in a variable called modal then it has a method called hide to hide the modal
  var modal = bootstrap.Modal.getInstance(
    document.getElementById("addContactModal"),
  );

  modal.hide();
}

// *function to reset all inputs after adding a contact*
function resetAllInputs() {
  fullNameInput.value = "";
  phoneNumberInput.value = "";
  emailAddressInput.value = "";
  addressInput.value = "";
  groupSelectInput.value = "";
  notesInput.value = "";
  favoriteInput.checked = false;
  emergencyInput.checked = false;
  contactImgInput.value = "";
  previewImg.src = "";
  previewImg.classList.add("d-none");
  previewIcon.classList.remove("d-none");
}

// *function to generate quick contact card for favorite and emergency sections*
function generateQuickContact(contact) {
  return `
  
  <div class="favorite-item">
    
    <div class="img-holder text-white">

  ${
    contact.image && contact.image !== ""
      ? `<img src="${contact.image}" alt="">`
      : // arrow function to get the first letter of the first and last name and convert it to uppercase (invoked function expression to execute the function immediately)
        (() => {
          // make array of the contact fullName(string) by splitting it by space e.g "Nada Mahrous" => ["Nada", "Mahrous"]
          let names = contact.fullName.split(" ");

          // return the first letter of the first and last name and convert it to uppercase
          return (names[0][0] + names[names.length - 1][0]).toUpperCase();
        })()
  }

</div>

    <div class="favorite-info">
      <h4 class="mb-0">${contact.fullName}</h4>
      <p>${contact.phoneNumber}</p>
    </div>

    <a
      href="tel:${contact.phoneNumber}"
      class="tale d-flex align-items-center justify-content-center ms-auto"
    >
      <i class="fa fa-phone"></i>
    </a>

  </div>

  `;
}

// *function to display contacts from contactList array*
function displayContact(contact = contactList) {
  // ^display total contacts count the top card^
  totalContactsInput.innerHTML = contactList.length;

  // ^display total contacts in the header section^
  document.getElementById("contactsCountText").innerHTML = contactList.length;

  // ^display favorite contacts count the top card^
  var favoriteCount = 0;
  // loop through contactList array and count how many contacts are marked as favorite
  for (var i = 0; i < contact.length; i++) {
    if (contact[i].favorite) {
      favoriteCount++;
    }
  }
  favoriteContactsInput.innerHTML = favoriteCount;

  // ^display emergency contacts count the top card^
  var emergencyCount = 0;
  // loop through contactList array and count how many contacts are marked as emergency
  for (var i = 0; i < contact.length; i++) {
    if (contact[i].emergency) {
      emergencyCount++;
    }
  }
  emergencyContactsInput.innerHTML = emergencyCount;

  // check if contactList array is empty and add empty state if it is empty
  if (contact.length === 0) {
    document.getElementById("rowData").innerHTML = `
        
        <div class="empty-state text-center d-flex flex-column align-items-center justify-content-center">
                    <div class="empty-icon d-flex align-items-center justify-content-center mb-3">
                      <i class="fa fa-address-book"></i>
                    </div>
                    <span>No contacts found</span>
                    <p>Click "Add Contact" to get started</p>
                  </div>
        
        `;

    document.getElementById("favoriteData").innerHTML =
      `<p>No favorite contacts</p>`;

    document.getElementById("emergencyData").innerHTML =
      `<p>No emergency contacts</p>`;

    return; // return to stop executing the rest of the function if there are no contacts
  }

  var contactCards = "";
  var favoriteCards = "";
  var emergencyCards = "";

  for (var i = 0; i < contact.length; i++) {
    // favorite section
    if (contact[i].favorite) {
      favoriteCards += generateQuickContact(contact[i]);
    }

    // emergency section
    if (contact[i].emergency) {
      emergencyCards += generateQuickContact(contact[i]);
    }
    // all contacts section
    contactCards += `

    <div class="col-12 col-md-6">
                    <div class="contact-card">
                      <!-- top section -->
                      <div class="contact-card-top">
                        <!-- top info -->
                        <div class="contact-main-info d-flex gap-3">
                          <!-- avatar -->
                          <div class="contact-avatar position-relative">
                            <div class="avatar-circle">

${
  contact[i].image && contact[i].image !== ""
    ? `<img src="${contact[i].image}" alt="">`
    : // if there is no image show the initials of the contact name
      // arrow function to get the first letter of the first and last name and convert it to uppercase (invoked function expression to execute the function immediately)
      (() => {
        // make array of the contact fullName(string) by splitting it by space e.g "Nada Mahrous" => ["Nada", "Mahrous"]
        let names = contact[i].fullName.split(" ");

        // return the first letter of the first and last name and convert it to uppercase
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      })()
}

</div>

                            ${
                              contact[i].favorite
                                ? `
  
  <!-- favorite -->
  <div class="small-badge favorite-small">
    <i class="fa fa-star"></i>
  </div>

`
                                : ""
                            }


${
  contact[i].emergency
    ? `
  
  <!-- emergency -->
  <div class="small-badge emergency-small">
    <i class="fa fa-heart-pulse"></i>
  </div>

`
    : ""
}
                          </div>

                          <!-- info -->
                          <div class="contact-info">
                            <!-- name + phone -->
                            <div class="pt-1">
                              <h3 class="mb-0">${contact[i].fullName}</h3>

                              <div class="d-flex mt-1 align-items-center gap-2">
                                <div class="phone-box">
                                  <i class="fa-solid fa-phone"></i>
                                </div>

                                <span class="contact-phone"> ${contact[i].phoneNumber} </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- middle info -->
                        <div class="contact-middle-info">
                          <!-- email -->
                          <div class="contact-line mb-2">
                            <div class="line-icon purple">
                              <i class="fa-solid fa-envelope"></i>
                            </div>

                            <p class="mb-0">${contact[i].emailAddress}</p>
                          </div>

                          <!-- location -->
                          <div class="contact-line">
                            <div class="line-icon green">
                              <i class="fa-solid fa-location-dot"></i>
                            </div>

                            <p class="mb-0">${contact[i].address}</p>
                          </div>

                          <!-- tags -->
                          <div class="contact-tags">

                                    ${
                                      contact[i].group &&
                                      contact[i].group !== "Select a group"
                                        ? `
<span class="tag family-tag">
    ${contact[i].group}
</span>
                            `
                                        : ""
                                    }${
                                      contact[i].emergency
                                        ? `
                                <span class="tag emergency-tag">
                                    <i class="fa-solid fa-heart-pulse"></i>
                                    Emergency
                                </span>
                             `
                                        : ""
                                    }

                        </div>
                        </div>
                      </div>

                      <!-- bottom -->
                      <div class="contact-card-bottom">
                        <div
                          class="d-flex align-items-center justify-content-between"
                        >
                          <!-- left -->
                          <div class="d-flex align-items-center gap-2">
                            <a
                              class="action-btn green-btn"
                              href="tel:${contact[i].phoneNumber}"
                            >
                              <i class="fa-solid fa-phone"></i>
                            </a>

                            <a
                              class="action-btn purple-btn"
                              href="mailto:${contact[i].emailAddress}"
                            >
                              <i class="fa-solid fa-envelope"></i>
                            </a>
                          </div>

                          <!-- right -->
                          <div class="d-flex align-items-center gap-2">
                            <!-- favorite -->
                            <button 
                              onclick="toggleStatus(${contact.length < contactList.length ? contact[i].oldIndex : i}, 'favorite')"
                              class="action-btn ${contact[i].favorite ? "yellow-btn" : "favorite-btn-empty"}"
                            >
                              <i class="${contact[i].favorite ? "fa-solid fa-star" : "fa-regular fa-star"}"></i>
                            </button>

                            <!-- emergency -->
                            <button 
                              onclick="toggleStatus(${contact.length < contactList.length ? contact[i].oldIndex : i}, 'emergency')"
                              class="action-btn ${contact[i].emergency ? "pink-btn" : "emergency-btn-empty"}"
                            >
                              <i class="${contact[i].emergency ? "fa-solid fa-heart-pulse" : "fa-regular fa-heart"}"></i>
                            </button>

                            <!-- edit -->
                            <button onclick="setDataToInputs(${contact.length < contactList.length ? contact[i].oldIndex : i})" class="action-btn gray-btn edit-btn">
                              <i class="fa-solid fa-pen"></i>
                            </button>

                            <!-- delete -->
                            <button onclick="deleteContact(${contact.length < contactList.length ? contact[i].oldIndex : i})" class="action-btn gray-btn delete-btn">
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    
    `;
  }
  // display all contacts in all contacts section
  document.getElementById("rowData").innerHTML = contactCards;

  // display favorite contacts in favorite section
  document.getElementById("favoriteData").innerHTML = favoriteCards;

  // display emergency contacts in emergency section
  document.getElementById("emergencyData").innerHTML = emergencyCards;
}

// *function to search for a contact by name or phone number or email and display the search results*
function searchContact(searchInput) {
  /* 
  if search input is empty display all contacts by calling 
  displayContact function with the original array(contactList) and return 
  to stop executing the rest of the function 
  */
  if (searchInput.trim() === "") {
    displayContact(contactList);
    // to stop excuting the rest of func.
    return;
  }

  // filter contactList array by name or phone number or email
  // and store the filtered contacts in a new array called filteredContacts
  var filteredContacts = [];

  // loop through contactList array and check if the contact fullName or phoneNumber or emailAddress
  // includes the searchInput value and if it does push it to the filteredContacts array
  for (let i = 0; i < contactList.length; i++) {
    if (
      contactList[i].fullName
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      contactList[i].phoneNumber.includes(searchInput) ||
      contactList[i].emailAddress
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    ) {
      /* 
      Adding a new property called oldIndex in each product object 
      in the original array (contactList) to store the original index of 
      the contact before filtering. 
      */
      /* 
      store the old index of the contact in the contact object to use it later 
      in the edit and delete functions because after filtering the index of 
      the contact will change so we need to store the old index before filtering
      */
      // خزنا القيمه الاصليه بتاعت الاندكس علشان لما امسح او عدل
      //  هستخدم الاندكس الاصلي اللي قبل الفلتر مش الاندكس الجديد اللي بعد الفلتر
      contactList[i].oldIndex = i;

      filteredContacts.push(contactList[i]);
    }
  }
  displayContact(filteredContacts);
}

// *variable to store the index of the contact that we want to update it when click on edit button and use it in updateContact function to update the contact by its index in the original array(contactList)*
var updateIndex = 0;

// *function to set contact data to inputs when click on edit button*
function setDataToInputs(index) {
  // store the index of the contact that we want to update it in the updateIndex variable to use it later in updateContact function
  updateIndex = index;

  // set data in the array to the value in the inputs
  fullNameInput.value = contactList[index].fullName;
  phoneNumberInput.value = contactList[index].phoneNumber;
  emailAddressInput.value = contactList[index].emailAddress;
  addressInput.value = contactList[index].address;
  groupSelectInput.value = contactList[index].group;
  notesInput.value = contactList[index].notes;
  favoriteInput.checked = contactList[index].favorite;
  emergencyInput.checked = contactList[index].emergency;

  // open modal
  var modal = new bootstrap.Modal(document.getElementById("addContactModal"));

  modal.show();

  // Hide Save button and show Update button
  saveBtnInput.classList.add("d-none");
  updateBtnInput.classList.remove("d-none");
}

function updateContact() {
  // console.log("Hello");
  // update data that found in the value of the input
  contactList[updateIndex].fullName = fullNameInput.value;
  contactList[updateIndex].phoneNumber = phoneNumberInput.value;
  contactList[updateIndex].emailAddress = emailAddressInput.value;
  contactList[updateIndex].address = addressInput.value;
  contactList[updateIndex].group = groupSelectInput.value;
  contactList[updateIndex].notes = notesInput.value;
  contactList[updateIndex].favorite = favoriteInput.checked;
  contactList[updateIndex].emergency = emergencyInput.checked;

  // update image if there is a new image
  // 
  if (contactImgInput.files.length > 0) {
    contactList[updateIndex].image = 
    `./imgs/${contactImgInput.files[0].name}`;
  }

  // save contacts to the localStorage after update
  localStorage.setItem("contactList", JSON.stringify(contactList));

  // loop over all contacts and display it after update
  displayContact(contactList);

  // reset inputs after update
  resetAllInputs();

  // hide modal after updating contact
  var modal = bootstrap.Modal.getInstance(
    document.getElementById("addContactModal"),
  );
  modal.hide();

  // success alert
  Swal.fire({
    title: "Updated!",
    text: "Contact has been updated successfully!",
    icon: "success",
    showConfirmButton: false,
    timer: 2000,
  });
  // show Save button and hide Update button
  saveBtnInput.classList.remove("d-none");
  updateBtnInput.classList.add("d-none");
}

// *function to toggle any boolean property*
function toggleStatus(index, type) {
  // toggle value
  // علشان عايزه لو مثلا الكونتاكت ده مش في ال فيفورت مثلا يعني الفيفورت فولس لما اضغط على زرار النجمه يتعمله ترو "ولو هو اصلا في الفيفورت يبقي ترو وهدوس علي زرار النجمه يبقي يتعمله فولس
  contactList[index][type] = !contactList[index][type];

  // save to local storage
  localStorage.setItem("contactList", JSON.stringify(contactList));

  // display contacts after toggling status
  displayContact(contactList);
}

// *function to delete a contact from contactList array and update local storage and UI accordingly*
function deleteContact(index) {
  // show confirmation dialog before deleting contact
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contactList[index].fullName}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#C62222",
    cancelButtonColor: "#606773",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // delete contact from the array by index
      contactList.splice(index, 1);

      // save contacts to the localStorage after delete
      localStorage.setItem("contactList", JSON.stringify(contactList));

      // loop over all contacts and display it after delete
      displayContact(contactList);

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
      });
    }
  });
}

// *object to store regex patterns for validating contact inputs*
var contactRegex = {
  nameRegex: /^[A-Za-z\u0600-\u06FF\s]{2,50}$/,
  phoneNumberRegex: /^01[0125][0-9]{8}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// *function to validate name input and show error message if name is invalid*
function validateInput(contactInput, regex, errorId) {
  // Check if contactInput is empty
  if (contactInput.value.trim() === "") {
    // Hide error message
    document.getElementById(errorId).classList.add("d-none");

    // Remove red border
    contactInput.classList.remove("is-invalid");

    // return;
    return false;
  }

  // Check if contactInput value matches regex
  if (regex.test(contactInput.value.trim())) {
    // Hide error message
    document.getElementById(errorId).classList.add("d-none");

    // Remove red border
    contactInput.classList.remove("is-invalid");

    return true;
  } else {
    // Show error message
    document.getElementById(errorId).classList.remove("d-none");

    // Add red border
    contactInput.classList.add("is-invalid");

    return false;
  }
}

// *event listener to save button to add contact*
saveBtnInput.addEventListener("click", function () {
  // // check if required inputs are empty
  // if (fullNameInput.value === "" || phoneNumberInput.value === "") {
  //   return;
  // }

  // call addContact function
  addContact();

  // // hide modal after adding contact
  // var modal = bootstrap.Modal.getInstance(
  //   document.getElementById("addContactModal"),
  // );

  // modal.hide();
});

// *event listener to search input to search for a contact by name or phone number or email and display the search results on input*
searchInput.addEventListener("input", function () {
  searchContact(this.value);
});

// *event listener to update button to update contact*
updateBtnInput.addEventListener("click", function () {
  updateContact();
});

// *event listener to full name input to validate name on input*
fullNameInput.addEventListener("input", function () {
  validateInput(fullNameInput, contactRegex.nameRegex, "fullNameError");
});

// *event listener to phone number input to validate phone number on input*
phoneNumberInput.addEventListener("input", function () {
  validateInput(phoneNumberInput, contactRegex.phoneNumberRegex, "phoneError");
});

// *event listener to email address input to validate email address on input*
emailAddressInput.addEventListener("input", function () {
  validateInput(emailAddressInput, contactRegex.emailRegex, "emailError");
});

// *event listener to contact image input to show preview of the selected image*
contactImgInput.addEventListener("change", function () {

  var file = contactImgInput.files[0];

  if (file) {

    //بتحول الصورة اللي من الجهاز لرابط مؤقت.
    var imageURL = URL.createObjectURL(file);


    // بحط الرابط ده في ال سورس بتاع ال الامج اللي في المودال
    //  عشان اعرض الصورة قبل ما احفظها.
    previewImg.src = imageURL;

    previewImg.classList.remove("d-none");

    previewIcon.classList.add("d-none");
  }

});