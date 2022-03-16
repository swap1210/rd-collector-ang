import { Language } from "../model/user.model";

export class CU {
	static monthOptions = { year: "numeric", month: "long" } as const;
	static dateOptions = {
		year: "numeric",
		month: "long",
		day: "2-digit",
	} as const;

	static err = {
		0: "माफ करना कुछ गड़बड़ हो गयी!",
	} as const;
	static msg = {
		0: "नमस्ते $,\n\nआपका *$* महीने का RD का *₹$* लेना बाकी है!\nकृपया *$* तारीख से पहले भुगतान करें!\n\nधन्यवाद ",
	} as const;

	static key = "678dfs983hjbd0dhjk089ck.,/apoioa";

	static translation: any = {
		"एक बार में कितने खाते देखने हैं: ": "Item per page: ",
		"RD कलेक्टर": "RD Collector",
		"फ़िल्टर से मेल खाने वाला कोई खाता नहीं मिला":
			"filter didn't match any account",
		"खाता नंबर": "Account No.",
		नाम: "Name",
		किस्त: "Installment",
		"नाम खोजे": "Account Search",
		"नया खाता": "New Account",
		"खाता नंबर $ में बदलाव": "Changes in Account No. $",
		"खाता नंबर <strong>जरूरी</strong> हैं":
			"Account No. is <strong>required</strong>",
		हैं: "",
		"खाता धारक का नाम": "Account Name",
		"खाता धारक का नाम <strong>जरूरी</strong> हैं":
			"Account Name is <strong>required</strong>",
		"कार्ड नंबर": "Card No.",
		"खाता आरंभ करने की तारीख": "Account Start Date",
		"आरंभ करने की तारीख डालना <strong>जरूरी</strong> हैं":
			"Account Start Date is <strong>required</strong>",
		"किस्त डालना <strong>जरूरी</strong> हैं":
			"Installment is <strong>required</strong>",
		"नॉमिनी का नाम": "Nominee Name",
		"फोन नंबर": "Phone No.",
		"फोन नंबर <strong>गलत</strong> है": "Phone is <strong>invalid</strong>",
		"खता चालू है": "Account is Active",
		"पीछे जाये ⬅": "Back ⬅",
		"सुधार करें": "Correct Account",
		"खता बनाए": "Create Account",
		"🏡": "🏡",
		"अंतिम तारीख": "Close Date",
		"आरंभ तारीख": "Start Date",
		"कलेक्शन राशि": "Collected Amount",
		"भुगतान राशि": "Paid Amount",
		"बिल की गई राशि": "Billed Amount",
		"अब तक की राशि": "Amount till Now",
		"ली जाने वाली राशि": "Amount to be taken",
		बकाया: "Amount Remaining",
		"रद्द करना": "Cancel",
		तारीख: "Date",
		आखरी: "Last",
		कलेक्ट: "Collect",
		बिल: "Bill",
		भुगतान: "Paid",
		"आखरी कलेक्शन तारीख": "Last Collection Date",
		"आखरी भुगतान तारीख": "Last Paid Date",
		"आखरी बिल तारीख": "Last Bill Date",
		"सभी खाते देखे": "View All Account",
		"बकाया खाते देखे": "View Pending Account",
		"कलेक्शन सूची": "Collection List",
		"भुगतान सूची": "Paid List",
		"खता सूची": "Account List",
		"खाता विवरण": "Account Detail",
		"मचुरेटी की तारीख": "Maturity Date",
		"होम स्क्रीन": "Home Screen",
		"$ का विवरण": "$ Details",
		"कलेक्शन बकाया": "Collection Pending",
		"भुगतान बकाया": "Payment Pending",
		"बिल बकाया": "Billing Pending",
		"स.ई.फ. नंबर": "CIF No.",
		"कलेक्शन या भुगतान सूची चुने": "Choose Collection or Paid List",
		"मैजिक खाते नंबर": "Magic Account Numbers",
		टोटल: "Total",
		"चुने गए खाते:": "Choosen Accounts:",
		सब: "All",
		राशि: "Amount",
	};

	constructor() {}
	static encrypt(p_value: string) {
		console.log("encrypt", p_value);
		var temp = "";
		var karr = this.key.split("");
		var i = 0;
		p_value.split("").forEach((element) => {
			temp += element + karr[i];
			i++;
			if (i === karr.length) {
				i = 0;
			}
		});

		return this.reverseString(temp);
	}

	static decrypt(p_encrypt_val: string) {
		var temp = "";
		p_encrypt_val = this.reverseString(p_encrypt_val);
		var valarr = p_encrypt_val.split("");

		valarr.forEach((ele, i) => {
			if (i % 2 == 0) {
				temp += ele;
			}
		});

		return temp;
	}
	static reverseString(str: string) {
		return str.split("").reverse().join("");
	}

	static t(p_lang: string, p_str: string): string {
		let temp = "";
		// console.log(p_lang, p_str);
		switch (p_lang) {
			case Language.EN:
				if (new Object(CU.translation).hasOwnProperty(p_str)) {
					temp = CU.translation[p_str];
					// console.log(p_lang, p_str, temp);
				} else {
					temp = "TNA: " + p_str;
				}
				break;
			case Language.HI:
				temp = p_str;
				break;
		}

		return temp;
	}

	static monthDiff(d1: Date, d2: Date) {
		var months;
		months = (d2.getFullYear() - d1.getFullYear()) * 12;
		months -= d1.getMonth();
		months += d2.getMonth();
		return months <= 0 ? 0 : months;
	}
	static addMonths(date: Date, months: number) {
		var d = date.getDate();
		date.setMonth(date.getMonth() + +months);
		if (date.getDate() != d) {
			date.setDate(0);
		}
		return date;
	}
	static dateFinder(
		p_startDate: Date,
		p_installment: number,
		p_paid: number
	): { calcDate: Date; amountShouldBe: number } {
		let finalDate = new Date(
			p_startDate.getFullYear(),
			p_startDate.getMonth(),
			1
		);
		finalDate = this.addMonths(finalDate, Math.floor(p_paid / p_installment));
		finalDate = new Date(finalDate.getFullYear(), finalDate.getMonth(), 0);

		let monthTillNow = this.monthDiff(p_startDate, new Date()) + 1;

		return {
			calcDate: finalDate,
			amountShouldBe: monthTillNow * p_installment,
		};
	}
}
