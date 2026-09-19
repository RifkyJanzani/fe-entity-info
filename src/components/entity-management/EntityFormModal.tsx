import { Button } from "@common/button/Button";
import CustomInput from "@common/custom-input/CustomInput";
import CustomTextArea from "@common/custom-textarea/CustomTextArea";
import Dropdown from "@common/dropdown/Dropdown";
import PopUp from "@common/pop-up/PopUp";

import {
	entityKindOptions,
	entityStatusOptions,
	getAttributesTextForKind
} from "@constants/entity-management.constants";

import {
	EntityFormState,
	EntityKind,
	EntityStatus,
	FormErrors,
	ModalMode
} from "../../domain/geospatial-entity";

interface EntityFormModalProps {
	isOpen: boolean;
	mode: ModalMode;
	draft: EntityFormState;
	errors: FormErrors;
	isSaving?: boolean;
	onClose: () => void;
	onChange: (nextDraft: EntityFormState) => void;
	onSubmit: () => void;
}

/**
 * Form modal dialog for creating and editing entities.
 *
 * @param {EntityFormModalProps} props - Component props.
 * @returns {React.ReactElement} The rendered modal.
 */
const EntityFormModal = ({
	isOpen,
	mode,
	draft,
	errors,
	isSaving = false,
	onClose,
	onChange,
	onSubmit
}: EntityFormModalProps) => {
	/**
	 * Updates a single field in the draft form.
	 *
	 * @param {keyof EntityFormState} key - Field key.
	 * @param {any} value - Next value.
	 */
	const updateDraft = <K extends keyof EntityFormState>(
		key: K,
		value: EntityFormState[K]
	) => {
		onChange({ ...draft, [key]: value });
	};

	/**
	 * Updates the entity kind and replaces default attributes.
	 *
	 * @param {EntityKind} value - Next entity kind.
	 */
	const updateKind = (value: EntityKind) => {
		onChange({
			...draft,
			kind: value,
			attributesText: getAttributesTextForKind(value)
		});
	};

	const submitLabel = isSaving
		? "Saving..."
		: mode === "edit"
			? "Save changes"
			: "Create entity";

	return (
		<PopUp
			title={mode === "edit" ? "Edit entity" : "Add entity"}
			width={720}
			height={620}
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className="flex h-full flex-col gap-4">
				<div className="grid gap-4 lg:grid-cols-2">
					<CustomInput
						name="name"
						value={draft.name}
						placeholder="Entity name"
						onChange={(value) => updateDraft("name", value)}
						error={Boolean(errors.name)}
						helperText={errors.name}
						disabled={isSaving}
					/>
					<Dropdown
						options={entityKindOptions}
						value={draft.kind}
						onChange={(value) => updateKind(value as EntityKind)}
						placeholder="Select entity type"
						disabled={isSaving}
					/>
					<Dropdown
						options={entityStatusOptions}
						value={draft.status}
						onChange={(value) => updateDraft("status", value as EntityStatus)}
						placeholder="Select status"
						disabled={isSaving}
					/>
					<div className="grid gap-4 sm:grid-cols-2">
						<CustomInput
							name="latitude"
							value={draft.latitude}
							placeholder="Latitude (-90 to 90)"
							onChange={(value) => updateDraft("latitude", value)}
							error={Boolean(errors.latitude)}
							helperText={errors.latitude}
							disabled={isSaving}
						/>
						<CustomInput
							name="longitude"
							value={draft.longitude}
							placeholder="Longitude (-180 to 180)"
							onChange={(value) => updateDraft("longitude", value)}
							error={Boolean(errors.longitude)}
							helperText={errors.longitude}
							disabled={isSaving}
						/>
					</div>
				</div>
				<CustomTextArea
					name="description"
					value={draft.description}
					placeholder="Describe the entity and its role"
					onChange={(value) => updateDraft("description", value)}
					error={Boolean(errors.description)}
					helperText={errors.description}
					disabled={isSaving}
					rows={4}
				/>
				<CustomTextArea
					name="attributes"
					value={draft.attributesText}
					placeholder="Attributes (e.g. Owner: Logistics Ops, one per line)"
					onChange={(value) => updateDraft("attributesText", value)}
					error={Boolean(errors.attributes)}
					helperText={errors.attributes}
					disabled={isSaving}
					rows={5}
				/>
				<div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
					<Button
						variant="outline"
						color="gray"
						onClick={onClose}
						disabled={isSaving}
					>
						Cancel
					</Button>
					<Button
						variant="solid"
						color="success"
						onClick={onSubmit}
						disabled={isSaving}
					>
						{submitLabel}
					</Button>
				</div>
			</div>
		</PopUp>
	);
};

export default EntityFormModal;
