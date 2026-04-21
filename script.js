import data from "./info.json" with { type: "json" };

const MILLISECONDS_IN_A_YEAR = 60 * 1000 * 60 * 24 * 365;

function calculateElapsedYears(initialDate) {
	return Math.floor(
		(Date.now() - new Date(initialDate).getTime()) / MILLISECONDS_IN_A_YEAR,
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
		data.contact.phone.countryCode + data.contact.phone.internationalPrefix + data.contact.phone.areaCode + data.contact.phone.number.replaceAll(" ", "")
	}`;

	let linkedInElement = document.getElementById("linkedin");
	linkedInElement.innerText = `linkedin.com/in/${data.contact.linkedin}`;
	linkedInElement.href = `https://www.linkedin.com/in/${data.contact.linkedin}`;

	let gitHubElement = document.getElementById("github");
	gitHubElement.innerText = `github.com/${data.contact.github}`;
	gitHubElement.href = `https://github.com/${data.contact.github}`;
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

function fillProfileSummary() {
	let profileSummary = data.profileSummary
		.join("<br><br>")
		.replace("TOTAL_EXPERIENCE", calculateElapsedYears(data.firstJobDate))
		.replace(
			"FRONTEND_EXPERIENCE",
			calculateElapsedYears(data.firstFrontendJobDate),
		);
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
			<span class="job-organization">${job.company}</span> – 
			<span class="job-location">
				${job.location.city}, ${job.location.country} |
			</span>
			<span class="job-dates"
				>${job.start.month + " " + job.start.year} – 
				${
					job.end
						? job.end.month + " " + job.end.year
						: "Actualidad"
				}
			</span>
		</div>
        <div class="job-responsibilities">
            ${job.responsibilities.join(" ")}
        </div>
        <div class="job-milestones">
            <ul>
				${job.achievements
					.map((achievement) => {
						return `<li><span class="milestone-title">${achievement.title}:</span> ${achievement.content}</li>`;
					})
					.join("")}
            </ul>
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
		<span class="education-program"
			>${education.program}</span
		>
		<div class="education-status">
			${education.status}
		</div>
        <p class="education-institute">
            ${education.institution} – ${education.location.city}, ${education.location.country}.
        </p>
    `;
	return educationElement;
}

function fillEducation() {
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
	courseElement.innerHTML = `${course.type}: 
        <span class="course-title">"${course.title}"</span>${course.hours ? " (" + course.hours + " hs)" : ""}.
        ${course.institution} (${formatDate(course.endDate)}).
    `;
	return courseElement;
}

function fillCourses() {
	let coursesContainer = document.getElementById("courses");
	data.courses
		.filter((course) => !course.hidden)
		.forEach((course) => {
			let courseElement = createCourse(course);
			coursesContainer.appendChild(courseElement);
		});
}

document.addEventListener("DOMContentLoaded", fillPersonalData);
document.addEventListener("DOMContentLoaded", fillLanguages);
document.addEventListener("DOMContentLoaded", fillTools);
document.addEventListener("DOMContentLoaded", fillProfileSummary);
document.addEventListener("DOMContentLoaded", fillExperience);
document.addEventListener("DOMContentLoaded", fillEducation);
document.addEventListener("DOMContentLoaded", fillCourses);
