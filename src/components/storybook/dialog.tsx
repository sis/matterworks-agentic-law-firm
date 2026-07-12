import type React from "react";

export interface DialogProps {
	title: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
	title,
	children,
	footer,
	className = "",
}) => {
	return (
		<div className={`demo-panel overflow-hidden p-0 ${className}`}>
			<div className="border-b px-6 py-4">
				<h2 className="demo-section-title">{title}</h2>
			</div>
			<div className="px-6 py-6">{children}</div>
			{footer && <div className="border-t bg-muted px-6 py-4">{footer}</div>}
		</div>
	);
};
