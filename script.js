import data from "./info.json" with { type: 'json' };

const MILLISECONDS_IN_A_YEAR = 60 * 1000 * 60 * 24 * 365;

function calculateElapsedYears(initialDate) {
	return Math.floor(
		(Date.now() - new Date(initialDate).getTime()) / MILLISECONDS_IN_A_YEAR
	);
}

/* TODO: Agregar telefono y mail */

function fillPersonalData() {
	document.title = `${data.name} ${data.surname} - CV`;

	document.getElementById(
		"full-name"
	).innerText = `${data.surname}, ${data.name}`;
	document.getElementById("role-title").innerText = data.headline;
	document.getElementById("age").innerHTML += `${calculateElapsedYears(
		data.birth
	)} Años`;

    document.querySelector("#photo img").src = data.profilePicture;

	let locationElement = document.getElementById("location");
	locationElement.innerText = `${data.location.city}, ${data.location.country}`;
	locationElement.href = data.location.mapsUrl;

	let linkedInElement = document.getElementById("linkedin");
	linkedInElement.innerText = data.contact.linkedin;
	linkedInElement.href = `https://www.linkedin.com/in/${data.contact.linkedin}/`;

	let gitHubElement = document.getElementById("github");
	gitHubElement.innerText = data.contact.github;
	gitHubElement.href = `https://github.com/${data.contact.github}/`;
}

function fillLanguages() {
    let languagesList = data.languages.map(lang => {
        return `<p><img src="${lang.logoUrl}" alt="" class="logo">${lang.name} (${lang.proficiency})</p>`;
    }).join('');
    document.getElementById("languages").innerHTML = languagesList;
}
function fillTools() {
    let toolsList = data.tools.map(tool => {
        return `<span class="tool pill"><span class="tool-title">${tool.name}</span><span>${tool.level}</span></span>`;
    }).join('');
    document.getElementById("tools").innerHTML = toolsList;
}

function fillSkills() {
    let skillsList = data.skills.map(skill => {
        return `<span class="pill">${skill[0].toUpperCase() + skill.slice(1)}</span>`;
    }).join("");
    document.getElementById("skills").innerHTML = skillsList;
}

function fillProfileSummary() {
    let profileSummary = data.profileSummary.replace("YEARS_PLACEHOLDER", calculateElapsedYears(data.firstJobDate));
    document.getElementById("profile").innerHTML = profileSummary;
}

function fillInterests() {
    let interestsList = data.interests.map(interest => {
        return `<span class="pill">${interest[0].toUpperCase() + interest.slice(1)}</span>`;
    }).join("");
    let hobbiesList = data.hobbies.map(hobby => {
        return `<span class="pill">${hobby[0].toUpperCase() + hobby.slice(1)}</span>`;
    }).join("");
    document.getElementById("interests").innerHTML = interestsList + hobbiesList;
}

window.addEventListener("load", fillPersonalData);
window.addEventListener("load", fillLanguages);
window.addEventListener("load", fillTools);
window.addEventListener("load", fillSkills);
window.addEventListener("load", fillProfileSummary);
window.addEventListener("load", fillInterests);
window.addEventListener("load", calculateSeniority);
