// A zip of every template, each at the path it goes to in a repository, so unzipping at the root of a project puts
// the files in place. Written by hand (stored entries, no compression): the files are small text and this avoids a
// dependency.
const encoder = new TextEncoder();

const crcTable = Array.from({ length: 256 }, (_, n) => {
	let c = n;
	for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	return c >>> 0;
});

const crc32 = (bytes) => {
	let crc = 0xffffffff;
	for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
};

// 1 January 2026, so the archive is the same on every build.
const DOS_TIME = 0;
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;

// `files` is a list of `{ name, text }`. Returns the zip as a Uint8Array.
export const zip = (files) => {
	const chunks = [];
	const central = [];
	let offset = 0;

	for (const { name, text } of files) {
		const nameBytes = encoder.encode(name);
		const data = encoder.encode(text);
		const crc = crc32(data);

		const local = new DataView(new ArrayBuffer(30));
		local.setUint32(0, 0x04034b50, true);
		local.setUint16(4, 20, true); // version needed
		local.setUint16(6, 0x0800, true); // UTF-8 names
		local.setUint16(8, 0, true); // stored
		local.setUint16(10, DOS_TIME, true);
		local.setUint16(12, DOS_DATE, true);
		local.setUint32(14, crc, true);
		local.setUint32(18, data.length, true);
		local.setUint32(22, data.length, true);
		local.setUint16(26, nameBytes.length, true);
		local.setUint16(28, 0, true);

		const entry = new DataView(new ArrayBuffer(46));
		entry.setUint32(0, 0x02014b50, true);
		entry.setUint16(4, 20, true); // version made by
		entry.setUint16(6, 20, true); // version needed
		entry.setUint16(8, 0x0800, true);
		entry.setUint16(10, 0, true);
		entry.setUint16(12, DOS_TIME, true);
		entry.setUint16(14, DOS_DATE, true);
		entry.setUint32(16, crc, true);
		entry.setUint32(20, data.length, true);
		entry.setUint32(24, data.length, true);
		entry.setUint16(28, nameBytes.length, true);
		entry.setUint32(42, offset, true);

		chunks.push(new Uint8Array(local.buffer), nameBytes, data);
		central.push(new Uint8Array(entry.buffer), nameBytes);
		offset += 30 + nameBytes.length + data.length;
	}

	const centralSize = central.reduce((sum, part) => sum + part.length, 0);
	const end = new DataView(new ArrayBuffer(22));
	end.setUint32(0, 0x06054b50, true);
	end.setUint16(8, files.length, true);
	end.setUint16(10, files.length, true);
	end.setUint32(12, centralSize, true);
	end.setUint32(16, offset, true);

	const parts = [...chunks, ...central, new Uint8Array(end.buffer)];
	const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
	let position = 0;
	for (const part of parts) {
		out.set(part, position);
		position += part.length;
	}
	return out;
};
