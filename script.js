// LANGUAGE CONFIGURATION

const LANGUAGE_SPANISH = "ES";
const LOCALE_SPANISH = "es-AR";

const LANGUAGE_ENGLISH = "EN";
const LOCALE_ENGLISH = "en-US";

// Change this variable to load a different language (make sure the corresponding JSON file exists in the data folder)
const LANGUAGE = LANGUAGE_SPANISH;
const LOCALE = LANGUAGE === LANGUAGE_SPANISH ? LOCALE_SPANISH : LOCALE_ENGLISH;

const CREDENTIAL_LABELS = {
	EN: "View Credential",
	ES: "Ver Credencial",
};

const MILLISECONDS_IN_A_YEAR = 60 * 1000 * 60 * 24 * 365;

async function getData(language) {
	const dataURI = `./data/info-${language}.json`;
	try {
		const response = await fetch(dataURI);
		if (response.ok) {
			const data = await response.json();
			return data;
		}
	} catch (error) {
		console.error("Error while obtaining resume data");
	}
}

function computeTotalExperience(experience) {
	let totalTime = experience.reduce((total, job) => {
		let jobStart = new Date(job.startDate).getTime();
		let jobEnd = job.endDate ? new Date(job.endDate).getTime() : Date.now();
		return total + (jobEnd - jobStart);
	}, 0);
	return Math.floor(totalTime / MILLISECONDS_IN_A_YEAR);
}

function formatDate(date, locale) {
	const options = {
		year: "numeric",
		month: "long",
	};
	let formattedDate = new Date(date).toLocaleDateString(locale, options);
	return formattedDate
		.replace(" de ", " ")
		.replace(formattedDate[0], formattedDate[0].toUpperCase());
}

function fillSectionHeadlines(data) {
	document.querySelector("#profile-header").innerText =
		data.sectionsHeadlines.profileSummary.toUpperCase();
	document.querySelector("#experience-header").innerText =
		data.sectionsHeadlines.experience.toUpperCase();
	document.querySelector("#courses-header").innerText =
		data.sectionsHeadlines.courses.toUpperCase();
	document.querySelector("#education-header").innerText =
		data.sectionsHeadlines.education.toUpperCase();
	document.querySelector("#competencies-header div.header.title").innerText =
		data.sectionsHeadlines.tools.toUpperCase();
	document.querySelector("#languages-info div.header.title").innerText =
		data.sectionsHeadlines.languages.toUpperCase();
}

function fillPersonalData(data) {
	document.title = `${data.name} ${data.surname} - Curriculum`;

	document.getElementById("full-name").innerText =
		`${data.name} ${data.surname}`;
	document.getElementById("role-title").innerText = data.headline;

	document.querySelector("#photo img").src = data.profilePicture;

	let locationElement = document.getElementById("location");
	locationElement.innerText = `${data.location.city}, ${data.location.country}`;
	locationElement.href = data.location.mapsUrl;

	let emailElement = document.getElementById("email");
	emailElement.innerText = data.contact.email;
	emailElement.href = `mailto:${data.contact.email}`;

	let phoneElement = document.getElementById("phone");
	phoneElement.innerText = `+${data.contact.phone.countryCode} ${data.contact.phone.internationalPrefix} ${data.contact.phone.areaCode} ${data.contact.phone.number}`;
	phoneElement.href = `tel:+${
		data.contact.phone.countryCode +
		data.contact.phone.internationalPrefix +
		data.contact.phone.areaCode +
		data.contact.phone.number.replaceAll(" ", "")
	}`;

	let linkedInElement = document.getElementById("linkedin");
	linkedInElement.innerText = `linkedin.com/in/${data.contact.linkedin}`;
	linkedInElement.href = `https://www.linkedin.com/in/${data.contact.linkedin}`;

	let gitHubElement = document.getElementById("github");
	gitHubElement.innerText = `github.com/${data.contact.github}`;
	gitHubElement.href = `https://github.com/${data.contact.github}`;
}

function fillLanguages(data) {
	let languagesList = data.languages
		.map((lang) => {
			return `<p><img src="${lang.logoUrl}" alt="" class="logo">${lang.name}: ${lang.proficiency}</p>`;
		})
		.join("");
	document.getElementById("languages").innerHTML = languagesList;
}

function fillTools(data) {
	data.toolCategories.forEach((category) => {
		let toolsList = data.tools
			.filter((tool) => tool.categoryId === category.id && !tool.hidden)
			.map((tool) => {
				return tool.name;
			})
			.join(", ");

		let categoryTools = document.createElement("p");
		categoryTools.innerHTML = `
		<div>
			<span class="tool-category">${category.description}</span>: ${toolsList}
		</div>
		`;

		document.getElementById("tools").appendChild(categoryTools);
	});
}

function fillProfileSummary(data) {
	let profileSummary = data.profileSummary
		.join("<br><br>")
		.replace("TOTAL_EXPERIENCE", computeTotalExperience(data.experience));
	document.getElementById("profile").innerHTML = profileSummary;
}

function createJob(job) {
	let jobElement = document.createElement("div");
	jobElement.classList.add("job");
	jobElement.innerHTML = `
		<span class="job-title"
			>${job.jobTitle}</span
		>
		<div>
			<span class="job-organization">${job.company}</span> - 
			<span class="job-location">
				${job.location.city}, ${job.location.country} |
			</span>
			<span class="job-dates"
				>${formatDate(job.startDate, LOCALE)} - 
				${job.endDate ? formatDate(job.endDate, LOCALE) : "Presente"}
			</span>
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
        `;
	return jobElement;
}

function fillExperience(data) {
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
		<span class="education-program"
			>${education.program}</span
		>
		<div class="education-status">
			${education.status}
		</div>
        <p class="education-institute">
            ${education.institution} - ${education.location.city}, ${education.location.country}.
        </p>
    `;
	return educationElement;
}

function fillEducation(data) {
	let educationContainer = document.getElementById("education");
	data.education
		.filter((education) => !education.hidden)
		.forEach((education) => {
			let educationElement = createFormalEducation(education);
			educationContainer.appendChild(educationElement);
		});
}

function createCourse(course) {
	let courseElement = document.createElement("p");
	courseElement.innerHTML = `<span class="course-title">${course.title}</span>${course.hours ? " (" + course.hours + " hs)" : ""} - 
        ${course.institution} | ${formatDate(course.endDate, LOCALE)} ${
			course.credentialUrl
				? '(<a href="' +
					course.credentialUrl +
					'" target="_blank">' +
					CREDENTIAL_LABELS[LANGUAGE] +
					"</a>)"
				: ""
		}
    `;
	return courseElement;
}

function fillCourses(data) {
	let coursesContainer = document.getElementById("courses");
	data.courses
		.filter((course) => !course.hidden)
		.forEach((course) => {
			let courseElement = createCourse(course);
			coursesContainer.appendChild(courseElement);
		});
}

function fillPage() {
	getData(LANGUAGE).then((data) => {
		fillSectionHeadlines(data);
		fillPersonalData(data);
		fillProfileSummary(data);
		fillExperience(data);
		fillCourses(data);
		fillEducation(data);
		fillTools(data);
		fillLanguages(data);
	}).catch(error => console.error ("Error while populating resume sections"));
}

document.addEventListener("DOMContentLoaded", fillPage);
