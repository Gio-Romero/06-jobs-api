import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showProfiles } from "./profiles.js";

let addEditDiv = null;
let profilename = null;
let position = null;
let age = null;
let addingProfile = null;

export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-profile");
    profilename = document.getElementById("profilename");
    position = document.getElementById("position");
    age = document.getElementById("age");
    addingProfile = document.getElementById("adding-profile");
    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingProfile) {
                enableInput(false);
                let method = "POST";
                let url = "/api/v1/profiles";
                if (addingProfile.textContent === "update") {
                    method = "PATCH";
                    url = `/api/v1/profiles/${addEditDiv.dataset.id}`;
                }
                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            profilename: profilename.value,
                            position: position.value,
                            age: age.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 200 || response.status === 201) {
                        if (response.status === 200) {
                            // a 200 is expected for a successful update
                            message.textContent = "The Profile entry was updated.";
                        } else {
                            // a 201 is expected for a successful create
                            message.textContent = "The Profile entry was created.";
                        }
                        profilename.value = "";
                        position.value = "";
                        age.value = "";
                        showProfiles();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.log(err);
                    message.textContent = "A communication error occurred.";
                }
                enableInput(true);
            } else if (e.target === editCancel) {
                message.textContent = "";
                showProfiles();
            }
        }
    });
};

export const showAddEdit = async (profileId) => {
    if (!profileId) {
        profilename.value = "";
        position.value = "";
        age.value = "";
        addingProfile.textContent = "add";
        message.textContent = "";
        setDiv(addEditDiv);
    } else {
        enableInput(false);
        try {
            const response = await fetch(`/api/v1/profiles/${profileId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                profilename.value = data.profile.profilename;
                position.value = data.profile.position;
                age.value = data.profile.age;
                addingProfile.textContent = "update";
                message.textContent = "";
                addEditDiv.dataset.id = profileId;

                setDiv(addEditDiv);
            } else {
                // might happen if the list has been updated since last display
                message.textContent = "The profiles entry was not found";
                showProfiles();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showProfiles();
        }
        enableInput(true);
    }
};

export const deleteProfile = async (profileId) => {
    enableInput(false);
    try {
        const response = await fetch(`/api/v1/profiles/${profileId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            message.textContent = "The delete was successful";
            showProfiles();
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communications error has occurred.";
        showProfiles();
    }
    enableInput(true);
}