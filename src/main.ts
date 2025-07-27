import { createSection } from './create.ts'
import './style.css'
import type { Website } from './types.ts'
import { supabase } from './globals.ts'

let { data: websites, error } = await supabase
	.from('Website')
	.select('*')
	.returns<Website[]>();

if (error) {
	console.error(error);
}

const websiteMap = new Map<string, Website[]>();
const sectionsDiv = document.querySelector(".sections") as HTMLDivElement;

for (const website of websites!) {
	if (!websiteMap.has(website.type!)) {
		websiteMap.set(website.type!, []);
	}
	websiteMap.get(website.type!)!.push(website);
}

for (const websiteType of websiteMap.keys()) {
	const sectionTitle = document.createElement("h2");
	sectionTitle.innerText = websiteType;
	const section = createSection(websiteType, websiteMap.get(websiteType)!);

	sectionsDiv.appendChild(sectionTitle);
	sectionsDiv.appendChild(section);
}

const addElementModal = document.querySelector(".add-element-modal") as HTMLButtonElement;

const addElementBtn = document.querySelector("#add-element") as HTMLButtonElement;
addElementBtn.addEventListener("click", () => {
	addElementModalToggle(true);
});

const addElementModalBtn = document.querySelector("#add-element-close") as HTMLDivElement;
const addElementModalSvg = document.querySelector("#close-add-element-modal") as HTMLDivElement;
[addElementModalBtn, addElementModalSvg].forEach((elem) => {
	elem.addEventListener("click", () => {
		addElementModalToggle(false);
		addElementUrlInput.value = "";
		addElementTypeInput.value = "";
	})
});

function addElementModalToggle(setVisible: boolean) {
	addElementModal.style.display = setVisible ? "grid" : "none";
}

const addElementUrlInput = document.querySelector("#add-element-url") as HTMLInputElement;
const addElementTypeInput = document.querySelector("#add-element-type") as HTMLInputElement;
const addElementTitleInput = document.querySelector("#add-element-title") as HTMLInputElement;

const addElementModalSubmit = document.querySelector("#add-element-submit") as HTMLButtonElement;
addElementModalSubmit.addEventListener("click", async () => {
	const website = {
		url: addElementUrlInput.value,
		title: addElementTitleInput.value,
		type: addElementTypeInput.value,
	} as Website;
	await supabase.from("Website").insert([website]);
	if (error) {
		console.error("Insert failed:", error.message);
	} else {
		console.log("Inserted successfully:");
	}
	addElementModalToggle(false);
	window.location.reload();
});
