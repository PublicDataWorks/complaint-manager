import models from "../index";

export const mapSignerToPayload = async signer => {
  const payload = {
    id: signer.id,
    name: signer.name,
    nickname: signer.nickname,
    title: signer.title,
    phone: signer.phone,
    links: [
      {
        rel: "signature",
        href: `/api/signers/${signer.id}/signature`
      }
    ]
  };

  const count = await models.letter_types.count({
    where: { default_sender: signer.id }
  });
  if (count === 0) {
    payload.links.push({
      rel: "delete",
      href: `/api/signers/${signer.id}`,
      method: "delete"
    });
  }

  return payload;
};
