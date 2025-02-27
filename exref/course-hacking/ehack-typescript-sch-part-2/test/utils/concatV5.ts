import { ethers } from 'hardhat';
import { BytesLike } from 'ethers';
const { getBytes } = ethers;

function addSlice(array: Uint8Array): Uint8Array {
	// if (array.slice) {
	if (Array.isArray(array)) {
		return array;
	}

	array.slice = function () {
		const args = Array.prototype.slice.call(arguments);
		return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
	};

	return array;
}

export function concatV5(items: ReadonlyArray<BytesLike>): Uint8Array {
	const objects = items.map((item) => getBytes(item));
	const length = objects.reduce((accum, item) => accum + item.length, 0);

	const result = new Uint8Array(length);

	objects.reduce((offset, object) => {
		result.set(object, offset);
		return offset + object.length;
	}, 0);

	return addSlice(result);
}
