import type React from "react";

export interface RadioOption {
	value: string;
	label: string;
}

export interface RadioGroupProps {
	label: string;
	name: string;
	options: RadioOption[];
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
	label,
	name,
	options,
	value,
	onChange,
	className = "",
}) => {
	return (
		<fieldset className={`flex flex-col gap-3 ${className}`}>
			<legend className="text-sm font-medium text-foreground">{label}</legend>
			<div className="flex gap-4">
				{options.map((option) => (
					<label
						key={option.value}
						className="flex items-center gap-2 cursor-pointer group"
					>
						<input
							type="radio"
							name={name}
							value={option.value}
							checked={value === option.value}
							onChange={(e) => onChange?.(e.target.value)}
							className="h-4 w-4 cursor-pointer accent-primary"
						/>
						<span className="demo-muted text-sm transition-colors group-hover:text-foreground">
							{option.label}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
};
