import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	EngineSection,
	FlowSection,
	HandsSection,
	MichaelSection,
	OurTimeSection,
	OverviewSection,
	PositionSection,
	StackSection,
	TimeSection,
	VisionFrame,
} from "./technical-vision";

const meta = {
	title: "The Pitch",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
	render: () => (
		<VisionFrame>
			<OverviewSection />
		</VisionFrame>
	),
};

export const WhatIsIt: Story = {
	name: "What Is It?",
	render: () => (
		<VisionFrame>
			<HandsSection />
		</VisionFrame>
	),
};

export const TheEngine: Story = {
	name: "The Engine",
	render: () => (
		<VisionFrame>
			<EngineSection />
		</VisionFrame>
	),
};

export const ExampleCase: Story = {
	name: "An Example Case",
	render: () => (
		<VisionFrame>
			<FlowSection />
		</VisionFrame>
	),
};

export const TheStack: Story = {
	name: "The Stack",
	render: () => (
		<VisionFrame>
			<StackSection />
		</VisionFrame>
	),
};

export const ForMichael: Story = {
	name: "For Michael",
	render: () => (
		<VisionFrame>
			<MichaelSection />
		</VisionFrame>
	),
};

export const YourTime: Story = {
	name: "Your Time",
	render: () => (
		<VisionFrame>
			<TimeSection />
		</VisionFrame>
	),
};

export const OurTime: Story = {
	name: "Our Time",
	render: () => (
		<VisionFrame>
			<OurTimeSection />
		</VisionFrame>
	),
};

export const UniquelyPositioned: Story = {
	name: "Why Are We Uniquely Positioned?",
	render: () => (
		<VisionFrame>
			<PositionSection />
		</VisionFrame>
	),
};
