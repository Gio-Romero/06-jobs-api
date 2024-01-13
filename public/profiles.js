import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { deleteProfile, showAddEdit } from "./addEdit.js";

let profilesDiv = null;
let profilesTable = null;
let profilesTableHeader = null;

export const handleProfiles = () => {
    profilesDiv = document.getElementById("profiles");
    const logoff = document.getElementById("logoff");
    const addProfile = document.getElementById("add-profile");
    profilesTable = document.getElementById("profiles-table");
    profilesTableHeader = document.getElementById("profiles-table-header");

    profilesDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addProfile) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                setToken(null);
                message.textContent = "You have been logged off.";
                profilesTable.replaceChildren([profilesTableHeader]);
                showLoginRegister();
            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);
            } else if (e.target.classList.contains("deleteButton")){
                message.textContent = "";
                deleteProfile(e.target.dataset.id)
            }
        }
    });
};

export const showProfiles = async () => {
    try {
        enableInput(false);

        const response = await fetch("/api/v1/profiles", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        let children = [profilesTableHeader];

        if (response.status === 200) {
            if (data.count === 0) {
                profilesTable.replaceChildren(...children); // clear this for safety
            } else {
                for (let i = 0; i < data.profiles.length; i++) {
                    let rowEntry = document.createElement("tr");

                    let editButton = `<td><button type="button" class="editButton" data-id=${data.profiles[i]._id}>edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.profiles[i]._id}>delete</button></td>`;
                    let rowHTML = `
              <td>${data.profiles[i].profilename}</td>
              <td>${data.profiles[i].position}</td>
              <td>${data.profiles[i].age}</td>
              <div>${editButton}${deleteButton}</div>`;

                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                profilesTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(profilesDiv);
};