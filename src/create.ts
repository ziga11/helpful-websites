import type { Website } from './types.ts'
import { supabase } from './globals.ts'


export function createSection(type: string, websitesOfType: Website[]): HTMLElement {
	const section = document.createElement("section");
	section.className = type;

	for (const website of websitesOfType) {
		const element = createElement(website);
		section.appendChild(element);
	}

	return section;
}

export function createElement(website: Website): HTMLAnchorElement {
	const aElement = document.createElement("a") as HTMLAnchorElement;
	aElement.className = "section-element";
	aElement.id = `${website.id!}`;
	aElement.title = website.title!;

	const url = website.url?.includes("https") ? website.url : `https://${website.url!}`;
	const domain = new URL(url).hostname;
	const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
	aElement.href = url;

	const deleteSvg = document.createElement("svg") as HTMLElement;
	deleteSvg.innerHTML = `
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
		<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
	</svg>`
	deleteSvg.style.cursor = "pointer";
	deleteSvg.style.position = "absolute";
	deleteSvg.style.zIndex = "3000";
	deleteSvg.style.top = "-15px";
	deleteSvg.style.right = "-10px";

	deleteSvg.addEventListener("mouseenter", () => {
		const svg = deleteSvg.querySelector("svg");
		if (svg) svg.style.fill = "red";
	});
	deleteSvg.addEventListener("mouseleave", () => {
		const svg = deleteSvg.querySelector("svg");
		if (svg) svg.style.fill = "currentColor";
	});

	deleteSvg.addEventListener("click", async (event) => {
		event.stopPropagation();
		event.preventDefault();

		const { error } = await supabase!.from("Website").delete().eq("id", website.id);
		if (error) {
			console.log("Error deleting the website --> " + error);
		}
		else {
			window.location.reload();
			console.log(`deleted website ${website}`)
		}
	});

	const img = document.createElement("img") as HTMLImageElement;
	img.src = faviconUrl;

	const title = document.createElement("b") as HTMLElement;
	title.innerText = website.title!;

	aElement.appendChild(img);
	aElement.appendChild(title);
	aElement.appendChild(deleteSvg);

	return aElement;
}

