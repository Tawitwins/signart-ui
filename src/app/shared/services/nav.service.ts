import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	constructor() { }

	public screenWidth: any;
	// public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			title: 'Accueil', type: 'link', active: false, path: 'pages/signart',
		},

		{
			title: 'Oeuvres', type: 'link', active: false, path: '/shop/collection/left/sidebar',
		},
		{
			title: 'Artistes', type: 'link', active: false, path: '/pages/allartist',
		},
		{
			title: 'Ils nous parlent', type: 'link', badge: true, path:'/pages/exposition', badgeText: 'Top', active: false,
		},
		{
			title: 'Evénements', type: 'link', active: false, path: '/pages/blog/left/sidebar',
		},
		{
			title: "Histoire de l'art", type: 'link', active: false, path: '/pages/histoire',
		},
		
		{
			title: 'Blog', type: 'link', active: false, path: '/pages/blog/left/sidebar',
		},
		
	];


	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

}
