import { ProgramConfig } from "game/dataBattle/program";

import hack1Icon from "../textures/grid/programs/hack_1.png";
import hack2Icon from "../textures/grid/programs/hack_2.png";
import hack3Icon from "../textures/grid/programs/hack_3.png";
import slingshotIcon from "../textures/grid/programs/slingshot.png";
import seeker1Icon from "../textures/grid/programs/seeker_1.png";
import seeker2Icon from "../textures/grid/programs/seeker_2.png";
import seeker3Icon from "../textures/grid/programs/seeker_3.png";
import bug1Icon from "../textures/grid/programs/bug_1.png";
import bug2Icon from "../textures/grid/programs/bug_2.png";
import bug3Icon from "../textures/grid/programs/bug_3.png";
import dataDoctor1Icon from "../textures/grid/programs/data_doctor_1.png";
import medicIcon from "../textures/grid/programs/medic.png";
import dataDoctor2Icon from "../textures/grid/programs/data_doctor_2.png";
import bitManIcon from "../textures/grid/programs/bit_man.png";
import clog1Icon from "../textures/grid/programs/clog_1.png";
import clog2Icon from "../textures/grid/programs/clog_2.png";
import clog3Icon from "../textures/grid/programs/clog_3.png";
import golem1Icon from "../textures/grid/programs/golem_1.png";
import golem2Icon from "../textures/grid/programs/golem_2.png";
import golem3Icon from "../textures/grid/programs/golem_3.png";
import spider1Icon from "../textures/grid/programs/spider_1.png";
import spider2Icon from "../textures/grid/programs/spider_2.png";
import spider3Icon from "../textures/grid/programs/spider_3.png";
import tower1Icon from "../textures/grid/programs/tower_1.png";
import tower2Icon from "../textures/grid/programs/tower_2.png";
import turbo1Icon from "../textures/grid/programs/turbo_1.png";
import turbo2Icon from "../textures/grid/programs/turbo_2.png";
import bomb1Icon from "../textures/grid/programs/bomb_1.png";
import bomb2Icon from "../textures/grid/programs/bomb_2.png";
import fiddleIcon from "../textures/grid/programs/fiddle.png";
import satellite1Icon from "../textures/grid/programs/satellite_1.png";
import satellite2Icon from "../textures/grid/programs/satellite_2.png";
import fling1Icon from "../textures/grid/programs/fling_1.png";
import fling2Icon from "../textures/grid/programs/fling_2.png";
import memoryHogIcon from "../textures/grid/programs/memory_hog.png";
import wizardIcon from "../textures/grid/programs/wizard.png";
import sumoIcon from "../textures/grid/programs/sumo.png";
import guruIcon from "../textures/grid/programs/guru.png";

export const allyPrograms: ProgramConfig[] = [
	{
		id: "hack_1",
		name: "Hack",
		desc: "Basic attack program",
		icon: hack1Icon,
		speed: 2,
		maxSize: 4,
		color: "#00c7ff",
		commands: [
			{
				name: "Slice",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "hack_2",
		name: "Hack 2.0",
		desc: "Improved Hack: Larger size and better attacks",
		icon: hack2Icon,
		speed: 3,
		maxSize: 4,
		color: "#00c7ff",
		commands: [
			{
				name: "Slice",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
			{
				name: "Dice",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				usable() {
					return this.slug.length >= 3;
				},
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 3);
				},
			},
		],
	},
	{
		id: "hack_3",
		name: "Hack 3.0",
		desc: "The top of the Hack series",
		icon: hack3Icon,
		speed: 4,
		maxSize: 4,
		color: "#00c7ff",
		commands: [
			{
				name: "Slice",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
			{
				name: "Mutilate",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				usable() {
					return this.slug.length >= 4;
				},
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 4);
				},
			},
		],
	},
	{
		id: "slingshot",
		name: "Slingshot",
		desc: "Basic ranged attack program",
		icon: slingshotIcon,
		speed: 2,
		maxSize: 2,
		color: "#00daa5",
		commands: [
			{
				name: "Stone",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 1);
				},
			},
		],
	},
	{
		id: "seeker_1",
		name: "Seeker",
		desc: "Solid distance attack program",
		icon: seeker1Icon,
		speed: 3,
		maxSize: 3,
		color: "#00daa5",
		commands: [
			{
				name: "Peek",
				desc: "TODO",
				range: 2,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "seeker_2",
		name: "Seeker 2.0",
		desc: "Bigger and better than seeker",
		icon: seeker2Icon,
		speed: 3,
		maxSize: 4,
		color: "#00daa5",
		commands: [
			{
				name: "Poke",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "seeker_3",
		name: "Seeker 3.0",
		desc: "Seeker with extra deletion power",
		icon: seeker3Icon,
		speed: 4,
		maxSize: 5,
		color: "#00daa5",
		commands: [
			{
				name: "Poke",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
			{
				name: "Seek and Destroy",
				desc: "TODO",
				range: 2,
				targets: ["enemy"],
				usable() {
					return this.slug.length >= 5;
				},
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return Promise.all([
						harmProgram(this, 2),
						harmProgram(target!, 5),
					]);
				},
			},
		],
	},
	{
		id: "bug_1",
		name: "Bug",
		desc: "Fast, cheap, and out of control",
		icon: bug1Icon,
		speed: 5,
		maxSize: 1,
		color: "#84fc00",
		commands: [
			{
				name: "Glitch",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "bug_2",
		name: "MandelBug",
		desc: "It's not a bug, it's a feature", // "Tiny but packs a big sting",
		icon: bug2Icon,
		speed: 5,
		maxSize: 1,
		color: "#84fc00", // "#fc00f9"
		commands: [
			{
				name: "Fractal Glitch",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 4);
				},
			},
		],
	},
	{
		id: "bug_3",
		name: "HeisenBug",
		desc: "They can't kill what they can't catch",
		icon: bug3Icon,
		speed: 5,
		maxSize: 1,
		color: "#84fc00",
		commands: [
			{
				name: "Quantum Glitch",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 6);
				},
			},
		],
	},
	{
		id: "data_doctor_1",
		name: "Data Doctor",
		desc: "Helps your programs grow",
		icon: dataDoctor1Icon,
		speed: 4,
		maxSize: 5,
		color: "#0132fa",
		commands: [
			{
				name: "Grow",
				desc: "TODO",
				range: 1,
				targets: ["ally"],
				effectType: "heal",
				effect(_, target, { healProgram }) {
					return healProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "medic",
		name: "Medic",
		desc: "Grows your programs from a distance",
		icon: medicIcon,
		speed: 3,
		maxSize: 3,
		color: "#0132fa",
		commands: [
			{
				name: "Hypo",
				desc: "TODO",
				range: 3,
				targets: ["ally"],
				effectType: "heal",
				effect(_, target, { healProgram }) {
					return healProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "data_doctor_2",
		name: "Data Doctor Pro",
		desc: "Twice the expansion power of the data doctor",
		icon: dataDoctor2Icon,
		speed: 5,
		maxSize: 8,
		color: "#0132fa",
		commands: [
			{
				name: "Megagrow",
				desc: "TODO",
				range: 1,
				targets: ["ally"],
				effectType: "heal",
				effect(_, target, { healProgram }) {
					return healProgram(target!, 4);
				},
			},
			{
				name: "Surgery",
				desc: "TODO",
				range: 1,
				targets: ["enemy", "ally"],
				effectType: "other",
				effect(_, target, { modProgram }) {
					modProgram(target!, "maxSize", (maxSize) => maxSize + 1);
				},
			},
		],
	},
	{
		id: "bit_man",
		name: "Bit-Man",
		desc: "Makes sectors of the grid appear or disappear",
		icon: bitManIcon,
		speed: 3,
		maxSize: 3,
		color: "#b4ff00",
		commands: [
			{
				name: "Zero",
				desc: "TODO",
				range: 1,
				targets: ["solid"],
				effectType: "other",
				effect(pos, _, { toggleSolid }) {
					toggleSolid(pos);
				},
			},
			{
				name: "One",
				desc: "TODO",
				range: 1,
				targets: ["void"],
				effectType: "other",
				effect(pos, _, { toggleSolid }) {
					toggleSolid(pos);
				},
			},
		],
	},
	{
		id: "clog_1",
		name: "Clog.01",
		desc: "Slows down hostile programs",
		icon: clog1Icon,
		speed: 2,
		maxSize: 4,
		color: "#00fdc7",
		commands: [
			{
				name: "Lag",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "other",
				effect(_, target, { modProgram }) {
					modProgram(target!, "speed", (speed) => speed - 1);
				},
			},
		],
	},
	{
		id: "clog_2",
		name: "Clog.02",
		desc: "Twice as effective as version.01",
		icon: clog2Icon,
		speed: 2,
		maxSize: 4,
		color: "#00fdc7",
		commands: [
			{
				name: "Chug",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "other",
				effect(_, target, { modProgram }) {
					modProgram(target!, "speed", (speed) => speed - 2);
				},
			},
		],
	},
	{
		id: "clog_3",
		name: "Clog.03",
		desc: "Brings hostile programs to a halt",
		icon: clog3Icon,
		speed: 2,
		maxSize: 4,
		color: "#00fdc7",
		commands: [
			{
				name: "Chug",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "other",
				usable() {
					return this.slug.length >= 1;
				},
				effect(_, target, { modProgram }) {
					modProgram(target!, "speed", (speed) => speed - 2);
				},
			},
			{
				name: "Hang",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "other",
				usable() {
					return this.slug.length >= 4;
				},
				effect(_, target, { modProgram }) {
					modProgram(target!, "speed", () => 0);
				},
			},
		],
	},
	{
		id: "golem_1",
		name: "Golem.mud",
		desc: "Slow and steady attack program",
		icon: golem1Icon,
		speed: 1,
		maxSize: 5,
		color: "#03fcf8",
		commands: [
			{
				name: "Thump",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 3);
				},
			},
		],
	},
	{
		id: "golem_2",
		name: "Golem.clay",
		desc: "Clay is stronger than mud",
		icon: golem2Icon,
		speed: 2,
		maxSize: 6,
		color: "#03fcf8",
		commands: [
			{
				name: "Bash",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 5);
				},
			},
		],
	},
	{
		id: "golem_3",
		name: "Golem.stone",
		desc: "Nothing can stand in its way",
		icon: golem3Icon,
		speed: 3,
		maxSize: 7,
		color: "#03fcf8",
		commands: [
			{
				name: "Crash",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 7);
				},
			},
		],
	},
	{
		id: "spider_1",
		name: "Wolf Spider",
		desc: "Speedy and creepy little program",
		icon: spider1Icon,
		speed: 3,
		maxSize: 3,
		color: "#14ea00",
		commands: [
			{
				name: "Byte",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "spider_2",
		name: "Black Widow",
		desc: "Speedier and creepier",
		icon: spider2Icon,
		speed: 4,
		maxSize: 3,
		color: "#14ea00",
		commands: [
			{
				name: "Byte",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
			{
				name: "Paralyze",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "other",
				effect(_, target, { modProgram }) {
					modProgram(target!, "speed", (speed) => speed - 3);
				},
			},
		],
	},
	{
		id: "spider_3",
		name: "Tarantula",
		desc: "Fast, with a venomous bite",
		icon: spider3Icon,
		speed: 5,
		maxSize: 3,
		color: "#14ea00",
		commands: [
			{
				name: "Megabyte",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 3);
				},
			},
			{
				name: "Paralyze",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "other",
				effect(_, target, { modProgram }) {
					modProgram(target!, "speed", (speed) => speed - 3);
				},
			},
		],
	},
	{
		id: "tower_1",
		name: "Tower",
		desc: "Immobile long-range program",
		icon: tower1Icon,
		speed: 0,
		maxSize: 1,
		color: "#01fc95",
		commands: [
			{
				name: "Spot",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 3);
				},
			},
		],
	},
	{
		id: "tower_2",
		name: "Mobile Tower",
		desc: "Slow-moving, long-range program",
		icon: tower2Icon,
		speed: 1,
		maxSize: 1,
		color: "#01fc95",
		commands: [
			{
				name: "Spot",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 3);
				},
			},
		],
	},
	{
		id: "turbo_1",
		name: "Turbo",
		desc: "Speeds up your programs",
		icon: turbo1Icon,
		speed: 3,
		maxSize: 3,
		color: "#0090fc",
		commands: [
			{
				name: "Boost",
				desc: "TODO",
				range: 1,
				targets: ["ally"],
				effectType: "other",
				effect(_, target, { harmProgram, modProgram }) {
					modProgram(target!, "speed", (speed) => speed + 1);
					return harmProgram(this, 1);
				},
			},
		],
	},
	{
		id: "turbo_2",
		name: "Turbo Deluxe",
		desc: "Slow and steady is for losers",
		icon: turbo2Icon,
		speed: 4,
		maxSize: 4,
		color: "#0090fc",
		commands: [
			{
				name: "Megaboost",
				desc: "TODO",
				range: 2,
				targets: ["ally"],
				effectType: "other",
				usable() {
					return this.slug.length >= 3;
				},
				effect(_, target, { harmProgram, modProgram }) {
					modProgram(target!, "speed", (speed) => speed + 2);
					return harmProgram(this, 2);
				},
			},
		],
	},
	{
		id: "bomb_1",
		name: "BuzzBomb",
		desc: "Fast and annoying",
		icon: bomb1Icon,
		speed: 8,
		maxSize: 2,
		color: "#0090fc",
		commands: [
			{
				name: "Sting",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 1);
				},
			},
			{
				name: "Kamikazee",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return Promise.all([
						harmProgram(target!, 5),
						harmProgram(this, this.slug.length),
					]);
				},
			},
		],
	},
	{
		id: "bomb_2",
		name: "LogicBomb",
		desc: "Self-destructing attack program",
		icon: bomb2Icon,
		speed: 3,
		maxSize: 6,
		color: "#0090fc",
		commands: [
			{
				name: "Selfdestruct",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				usable() {
					return this.slug.length >= 6;
				},
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return Promise.all([
						harmProgram(target!, 10),
						harmProgram(this, this.slug.length),
					]);
				},
			},
		],
	},
	{
		id: "fiddle",
		name: "Fiddle",
		desc: "Twiddle and Tweak the power of your programs",
		icon: fiddleIcon,
		speed: 3,
		maxSize: 3,
		color: "#0090fc",
		commands: [
			{
				name: "Tweak",
				desc: "TODO",
				range: 1,
				targets: ["ally"],
				effectType: "other",
				effect(_, target, { harmProgram, modProgram }) {
					modProgram(target!, "speed", (speed) => speed + 1);
					return harmProgram(this, 1);
				},
			},
			{
				name: "Twiddle",
				desc: "TODO",
				range: 1,
				targets: ["ally"],
				effectType: "other",
				effect(_, target, { harmProgram, modProgram }) {
					modProgram(target!, "maxSize", (maxSize) => maxSize + 1);
					return harmProgram(this, 1);
				},
			},
		],
	},
	{
		id: "satellite_1",
		name: "Satellite",
		desc: "Sort-rang hard-hitting program",
		icon: satellite1Icon,
		speed: 1,
		maxSize: 1,
		color: "#00fccb",
		commands: [
			{
				name: "Scramble",
				desc: "TODO",
				range: 2,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 4);
				},
			},
		],
	},
	{
		id: "satellite_2",
		name: "Laser Satellite",
		desc: "Long-range hard-hitting program",
		icon: satellite2Icon,
		speed: 2,
		maxSize: 1,
		color: "#00fccb",
		commands: [
			{
				name: "Megascramble",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 4);
				},
			},
		],
	},
	{
		id: "fling_1",
		name: "Ballista",
		desc: "Extreme-range attack program",
		icon: fling1Icon,
		speed: 1,
		maxSize: 2,
		color: "#00daa5",
		commands: [
			{
				name: "Fling",
				desc: "TODO",
				range: 4,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "fling_2",
		name: "Catapult",
		desc: "Extreme-range mobile attacker",
		icon: fling2Icon,
		speed: 2,
		maxSize: 3,
		color: "#00daa5",
		commands: [
			{
				name: "Fling",
				desc: "TODO",
				range: 4,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
		],
	},
	{
		id: "memory_hog",
		name: "Memory Hog",
		desc: "Massive memory-filling bloatware",
		icon: memoryHogIcon,
		speed: 5,
		maxSize: 30,
		color: "#b6fb00",
		commands: [],
	},
	{
		id: "wizard",
		name: "Wizard",
		desc: "Pay no attention to the man behind the curtain",
		icon: wizardIcon,
		speed: 3,
		maxSize: 4,
		color: "#01fc95",
		commands: [
			{
				name: "Scorch",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 2);
				},
			},
			{
				name: "Stretch",
				desc: "TODO",
				range: 2,
				targets: ["ally"],
				effectType: "other",
				effect(_, target, { modProgram }) {
					modProgram(target!, "maxSize", (maxSize) => maxSize + 1);
				},
			},
		],
	},
	{
		id: "sumo",
		name: "Sumo",
		desc: "A massive and slow-moving powerhouse",
		icon: sumoIcon,
		speed: 2,
		maxSize: 12,
		color: "#b6fc01", // "#cd7ffd",
		commands: [
			{
				name: "Dataslam",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				usable() {
					return this.slug.length >= 6;
				},
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 8);
				},
			},
		],
	},
	{
		id: "guru",
		name: "Guru",
		desc: "Multipurpose software for the l33tist of the l33t",
		icon: guruIcon,
		speed: 2,
		maxSize: 3,
		color: "#04facb",
		commands: [
			{
				name: "Fire",
				desc: "TODO",
				range: 2,
				targets: ["enemy"],
				effectType: "harm",
				effect(_, target, { harmProgram }) {
					return harmProgram(target!, 4);
				},
			},
			{
				name: "Ice",
				desc: "TODO",
				range: 2,
				targets: ["enemy"],
				effectType: "other",
				effect(_, target, { modProgram }) {
					modProgram(target!, "speed", (speed) => speed - 3);
				},
			},
		],
	},
];
