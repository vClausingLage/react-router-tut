import { Form, useLoaderData, useFetcher } from "react-router-dom"
import { getContact, updateContact } from "../contacts"

export async function loader({ params }: any) {
    const contact = await getContact(params.contactId);
    if (!contact) {
        throw new Response("", {
            status: 404,
            statusText: "Not Found",
        });
    }
    return { contact };
}

export async function action({ request, params }: any) {
    let formData = await request.formData()
    return updateContact(params.contactId, {
        favorite: formData.get("favorite") === "true",
    });
}

export default function Contact() {
    const { contact } = useLoaderData() as any

    return (
        <div id="contact">
            <div>
                <img
                    key={contact?.avatar}
                    src={contact?.avatar || undefined}
                />
            </div>

            <div>
                <h1>
                    {contact?.first || contact?.last ? (
                        <>
                            {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact?.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact?.twitter}`}
                        >
                            {contact?.twitter}
                        </a>
                    </p>
                )}

                {contact?.notes && <p>{contact?.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                                !confirm(
                                    "Please confirm you want to delete this record."
                                )
                            ) {
                                event.preventDefault()
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

type Contact = {
    contact: {
        first: string
        last: string
        avatar: string
        twitter: string
        notes: string
        favorite: boolean
    }
}

function Favorite({ contact }: Contact) {
    const fetcher = useFetcher()
    // yes, this is a `let` for later
    let favorite = contact?.favorite
    if (fetcher.formData) {
        favorite = fetcher.formData.get("favorite") === "true";
    }
    return (
        <fetcher.Form method="post">
            <button
                name="favorite"
                value={favorite ? "false" : "true"}
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
}