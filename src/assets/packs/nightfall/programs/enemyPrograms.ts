import { ProgramConfig } from "game/dataBattle/program";

import sentinel1Icon from '../textures/grid/programs/sentinel_1.png';
import sentinel2Icon from '../textures/grid/programs/sentinel_2.png';
import sentinel3Icon from '../textures/grid/programs/sentinel_3.png';
import watchman1Icon from '../textures/grid/programs/watchman_1.png';
import watchman2Icon from '../textures/grid/programs/watchman_2.png';
import watchman3Icon from '../textures/grid/programs/watchman_3.png';
import dog1Icon from '../textures/grid/programs/dog_1.png';
import dog2Icon from '../textures/grid/programs/dog_2.png';
import dog3Icon from '../textures/grid/programs/dog_3.png';
import warden1Icon from '../textures/grid/programs/warden_1.png';
import warden2Icon from '../textures/grid/programs/warden_2.png';
import warden3Icon from '../textures/grid/programs/warden_3.png';
import ping1Icon from '../textures/grid/programs/ping_1.png';
import ping2Icon from '../textures/grid/programs/ping_2.png';
import ping3Icon from '../textures/grid/programs/ping_3.png';
import fireWallIcon from '../textures/grid/programs/fire_wall.png';
import bossIcon from '../textures/grid/programs/boss.png';

export const enemyPrograms: ProgramConfig[] = [
	{
		id: "sentinel_1",
		name: "Sentinel",
		desc: "Corporate data defender",
		icon: sentinel1Icon,
		speed: 1,
		maxSize: 3,
		color: "#fc9800",
		commands: [
			{
				name: "Cut",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "sentinel_2",
		name: "Sentinel 2.0",
		desc: "Improved corporate data defender",
		icon: sentinel2Icon,
		speed: 2,
		maxSize: 4,
		color: "#fc9800",
		commands: [
			{
				name: "Cut",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "sentinel_3",
		name: "Sentinel 3.0",
		desc: "Top of the line in corporate data defense",
		icon: sentinel3Icon,
		speed: 2,
		maxSize: 4,
		color: "#fc9800",
		commands: [
			{
				name: "Taser",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(4);
				},
			},
		],
	},
	{
		id: "watchman_1",
		name: "Watchman",
		desc: "Corporate ranged attack program",
		icon: watchman1Icon,
		speed: 1,
		maxSize: 2,
		color: "#ff258a",
		commands: [
			{
				name: "Phaser",
				desc: "TODO",
				range: 2,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "watchman_2",
		name: "Watchman X",
		desc: "Improved version of Watchman",
		icon: watchman2Icon,
		speed: 1,
		maxSize: 4,
		color: "#ff258a",
		commands: [
			{
				name: "Phaser",
				desc: "TODO",
				range: 2,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "watchman_3",
		name: "Watchman SP",
		desc: "Qui custodiet ipsos custodes?",
		icon: watchman3Icon,
		speed: 1,
		maxSize: 4,
		color: "#ff258a",
		commands: [
			{
				name: "Photon",
				desc: "TODO",
				range: 3,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "dog_1",
		name: "Guard Pup",
		desc: "A speedy little corporate cur",
		icon: dog1Icon,
		speed: 3,
		maxSize: 2,
		color: "#fcbb00",
		commands: [
			{
				name: "Byte",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "dog_2",
		name: "Guard Dog",
		desc: "Who let the dogs out?",
		icon: dog2Icon,
		speed: 3,
		maxSize: 3,
		color: "#fcbb00",
		commands: [
			{
				name: "Byte",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "dog_3",
		name: "Attack Dog",
		desc: "Ravenous and bloodthirsty corporate canine",
		icon: dog3Icon,
		speed: 4,
		maxSize: 7,
		color: "#fcbb00",
		commands: [
			{
				name: "Megabyte",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(3);
				},
			},
		],
	},
	{
		id: "warden_1",
		name: "Warden",
		desc: "Slow and steady corporate attack program",
		icon: warden1Icon,
		speed: 1,
		maxSize: 5,
		color: "#fc0010",
		commands: [
			{
				name: "Thump",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(3);
				},
			},
		],
	},
	{
		id: "warden_2",
		name: "Warden+",
		desc: "Get out of its way",
		icon: warden2Icon,
		speed: 2,
		maxSize: 6,
		color: "#fc0010",
		commands: [
			{
				name: "Bash",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(5);
				},
			},
		],
	},
	{
		id: "warden_3",
		name: "Warden++",
		desc: "The last word in corporate security",
		icon: warden3Icon,
		speed: 3,
		maxSize: 7,
		color: "#fc0010",
		commands: [
			{
				name: "Crash",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(7);
				},
			},
		],
	},
	{
		id: "ping_1",
		name: "Sensor",
		desc: "Immobile program eradicator",
		icon: ping1Icon,
		speed: 0,
		maxSize: 1,
		color: "#fcf101",
		commands: [
			{
				name: "Blip",
				desc: "TODO",
				range: 5,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(1);
				},
			},
		],
	},
	{
		id: "ping_2",
		name: "Radar",
		desc: "Deadly program eradicator",
		icon: ping2Icon,
		speed: 0,
		maxSize: 1,
		color: "#fcf101",
		commands: [
			{
				name: "Pong",
				desc: "TODO",
				range: 5,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(2);
				},
			},
		],
	},
	{
		id: "ping_3",
		name: "Sonar",
		desc: "Long-range program eradicator",
		icon: ping3Icon,
		speed: 0,
		maxSize: 1,
		color: "#fcf101",
		commands: [
			{
				name: "Ping",
				desc: "TODO",
				range: 8,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(1);
				},
			},
		],
	},
	{
		id: "fire_wall",
		name: "Fire Wall",
		desc: "Keeps unwanted programs out of corporate sectors",
		icon: fireWallIcon,
		speed: 2,
		maxSize: 20,
		color: "#fc6200",
		commands: [
			{
				name: "Burn",
				desc: "TODO",
				range: 1,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(1);
				},
			},
		],
	},
	{
		id: "boss",
		name: "Boss",
		desc: "Prepare to be owned",
		icon: bossIcon,
		speed: 6,
		maxSize: 25,
		color: "#fc6200",
		commands: [
			{
				name: "Shutdown",
				desc: "TODO",
				range: 5,
				targets: ["enemy"],
				effectType: "harm",
				effect: target => {
					target.harm(5);
				},
			},
		],
	},
];
