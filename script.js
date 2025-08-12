import data from "./info.json" with { type: "json" };

const MILLISECONDS_IN_A_YEAR = 60 * 1000 * 60 * 24 * 365;

const PHOTO = document.getElementById("photo");
const CONTACT_INFO = document.getElementById("contact-info");

const SIDE_BAR = document.getElementById("side-bar");
const MAIN_HEADER = document.getElementById("main-header");

function calculateElapsedYears(initialDate) {
	return Math.floor(
		(Date.now() - new Date(initialDate).getTime()) / MILLISECONDS_IN_A_YEAR
	);
}

function formatDate(date) {
	const options = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	};
	return new Date(date).toLocaleDateString("es-AR", options);
}

function fillPersonalData() {
	document.title = `${data.name} ${data.surname} - CV`;

	document.getElementById(
		"full-name"
	).innerText = `${data.surname}, ${data.name}`;
	document.getElementById("role-title").innerText = data.headline;

	document.querySelector("#photo img").src = data.profilePicture;

	let locationElement = document.getElementById("location");
	locationElement.innerText = `${data.location.city} (${data.location.country})`;
	locationElement.href = data.location.mapsUrl;

	let emailElement = document.getElementById("email");
	emailElement.innerText = data.contact.email;
	emailElement.href = `mailto:${data.contact.email}`;

	let linkedInElement = document.getElementById("linkedin");
	linkedInElement.innerText = data.contact.linkedin;
	linkedInElement.href = `https://www.linkedin.com/in/${data.contact.linkedin}/`;

	let gitHubElement = document.getElementById("github");
	gitHubElement.innerText = data.contact.github;
	gitHubElement.href = `https://github.com/${data.contact.github}/`;
}

function fillLanguages() {
	let languagesList = data.languages
		.map((lang) => {
			return `<p><img src="${lang.logoUrl}" alt="" class="logo">${lang.name} (${lang.proficiency})</p>`;
		})
		.join("");
	document.getElementById("languages").innerHTML = languagesList;
}

function fillTools() {
	let toolsList = data.tools
		.filter((tool) => !tool.hidden)
		.map((tool) => {
			return `<span class="tool pill"><span class="tool-title">${tool.name}</span><span>${tool.level}</span></span>`;
		})
		.join("");
	document.getElementById("tools").innerHTML = toolsList;
}

function fillSkills() {
	let skillsList = data.skills
		.map((skill) => {
			return `<span class="pill">${
				skill[0].toUpperCase() + skill.slice(1)
			}</span>`;
		})
		.join("");
	document.getElementById("skills").innerHTML = skillsList;
}

function fillProfileSummary() {
	let profileSummary = data.profileSummary
		.join("<br><br>")
		.replace("TOTAL_EXPERIENCE", calculateElapsedYears(data.firstJobDate))
		.replace("FRONTEND_EXPERIENCE", calculateElapsedYears(data.firstFrontendJobDate));
	document.getElementById("profile").innerHTML = profileSummary;
}

function fillInterests() {
	let interestsList = data.interests
		.map((interest) => {
			return `<span class="pill">${
				interest[0].toUpperCase() + interest.slice(1)
			}</span>`;
		})
		.join("");
	let hobbiesList = data.hobbies
		.map((hobby) => {
			return `<span class="pill">${
				hobby[0].toUpperCase() + hobby.slice(1)
			}</span>`;
		})
		.join("");
	document.getElementById("interests").innerHTML =
		interestsList + hobbiesList;
}

function createJob(job) {
	let jobElement = document.createElement("div");
	jobElement.classList.add("job");
	jobElement.innerHTML = `
        <div class="job-headline">
            <span class="job-title"
                >${job.jobTitle}</span
            >
            <div class="text-end">
                <span class="job-organization"> ${job.company}, </span>
                <span class="job-location">
                    ${job.location}.
                </span>
                <span class="job-dates"
                    >${job.start.month + " " + job.start.year} a 
                    ${
						job.end
							? job.end.month + " " + job.end.year
							: "la Actualidad"
					}
                </span>
            </div>
        </div>
        <p class="job-industry">
            ${job.companyDetail}
        </p>
        <div class="job-responsibilities">
            ${job.responsibilities.join(" ")}
        </div>
        <div class="job-milestones">
            <ul>
                ${job.achievements
					.map((achievement) => {
						return `<li>${achievement}</li>`;
					})
					.join("")}
            </ul>
        </div>
        <div class="job-stack">
            Herramientas:
            <span class="list">
                ${job.tools.join(", ")}
            </span>
        </div>
        `;
	return jobElement;
}

function fillExperience() {
	let experienceContainer = document.getElementById("experience");
	data.experience
		.filter((job) => !job.hidden)
		.forEach((job) => {
			let jobElement = createJob(job);
			experienceContainer.appendChild(jobElement);
		});
}

function createFormalEducation(education) {
	let educationElement = document.createElement("div");
	educationElement.classList.add("formal-learning");
	educationElement.innerHTML = `
        <div class="education-headline">
            <span class="education-program"
                >${education.program}</span
            >
            <span class="education-egress-date text-end">Fecha de egreso: 
                ${education.end.month + " " + education.end.year} ${
		!education.finished ? "(en curso)" : ""
	}
            </span>
        </div>
        <p class="education-institute">
            ${education.institution}, ${education.location}.
        </p>
    `;
	return educationElement;
}

function fillEducation() {
	let educationContainer = document.getElementById("education");
	data.education.forEach((education) => {
		let educationElement = createFormalEducation(education);
		educationContainer.appendChild(educationElement);
	});
}

function createCertification(certification) {
	let certificationElement = document.createElement("div");
	certificationElement.classList.add("certification-card", "content", "box");
	certificationElement.innerHTML = `
        <img src="${certification.badgeIcon}" alt="${certification.name} badge">
        <div class="certification-title">${certification.name}</div>
        <div class="certification-issue">${
			certification.issuingOrganization
		} (${formatDate(certification.issueDate)})</div>
        <a class="certification-validation-url" href="${
			certification.credentialUrl
		}" target="_blank">Validar</a>
    `;
	return certificationElement;
}

function fillCertifications() {
	let certificationsContainer = document.getElementById("certifications");
	data.certifications.forEach((certification) => {
		let certificationElement = createCertification(certification);
		certificationsContainer.appendChild(certificationElement);
	});
}

function createCourse(course) {
	let courseElement = document.createElement("p");
	courseElement.innerHTML = `
        <span class="course-title">"${course.title}"</span> (${
		course.hours ? course.hours + " HORAS" : "ASINCRONICO"
	}).
        ${course.institution} (${formatDate(course.endDate)}).
    `;
	return courseElement;
}

function fillCourses() {
	let coursesContainer = document.getElementById("courses");
	data.courses.forEach((course) => {
		if (course.hidden) return; // Skip hidden courses
		let courseElement = createCourse(course);
		coursesContainer.appendChild(courseElement);
	});
}

// Mobile version

function onMobile () {
	return window.innerWidth <= 720;
}

function movePhotoAndContactInfo () {
	if (onMobile()) {
		MAIN_HEADER.prepend(PHOTO);
		MAIN_HEADER.append(CONTACT_INFO);
	} else {
		SIDE_BAR.prepend(PHOTO, CONTACT_INFO);
	}
}

document.addEventListener("DOMContentLoaded", movePhotoAndContactInfo);
window.addEventListener("resize", movePhotoAndContactInfo);

document.addEventListener("DOMContentLoaded", fillPersonalData);
document.addEventListener("DOMContentLoaded", fillLanguages);
document.addEventListener("DOMContentLoaded", fillTools);
document.addEventListener("DOMContentLoaded", fillSkills);
document.addEventListener("DOMContentLoaded", fillProfileSummary);
document.addEventListener("DOMContentLoaded", fillInterests);
document.addEventListener("DOMContentLoaded", fillExperience);
document.addEventListener("DOMContentLoaded", fillEducation);
document.addEventListener("DOMContentLoaded", fillCertifications);
document.addEventListener("DOMContentLoaded", fillCourses);
