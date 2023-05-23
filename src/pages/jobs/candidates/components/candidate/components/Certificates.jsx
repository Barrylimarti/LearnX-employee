const CertificateItem = ({ name, about, image, onRequestDelete }) => {
	return (
		<div className="relative flex items-center gap-4 px-8 py-2 rounded-lg mb-4 bg-background-0">
			<div className="shrink-0 max-h-full w-1/4">
				<img className="max-h-full rounded-lg object-cover" src={"/" + image} alt="cert" />
			</div>
			<div>
				<p className="text-lg font-medium">{name}</p>
				<p className="text-sm text-primary-washedout/75 mt-2">{about}</p>
			</div>
		</div>
	);
};

const Certificates = ({ certificates }) => {
	return (
		<div className="flex flex-col bg-neutral-0 rounded-2xl">
			{certificates.length > 0 ? (
				certificates.map(({ _id, name, about, file }, i) => (
					<CertificateItem
						name={name}
						about={about}
						image={file}
						key={_id + i}
						onRequestDelete={() => deleteCertificate(_id)}
					/>
				))
			) : (
				<div className="grow flex items-center justify-center p-8">
					<h3 className="text-base font-medium text-primary-default/75">No certificates</h3>
				</div>
			)}
		</div>
	);
};

export default Certificates;
