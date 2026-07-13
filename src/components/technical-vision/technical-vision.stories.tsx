import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	FlowSection,
	OverviewSection,
	PrinciplesSection,
	StackSection,
	TimeSection,
	VisionFrame,
} from "./technical-vision";

const meta = {
	title: "Technical Vision",
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

export const Principles: Story = {
	render: () => (
		<VisionFrame>
			<PrinciplesSection />
		</VisionFrame>
	),
};

export const TheFlow: Story = {
	name: "The Flow",
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

export const YourTime: Story = {
	name: "Your Time",
	render: () => (
		<VisionFrame>
			<TimeSection />
		</VisionFrame>
	),
};
