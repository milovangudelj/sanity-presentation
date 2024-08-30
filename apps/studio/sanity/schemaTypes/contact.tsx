import { User } from "@phosphor-icons/react";
import { defineField, defineType, PreviewProps } from "sanity";
import { Badge, Box, Flex } from "@sanity/ui";
import { formatDistance } from "date-fns";

export default defineType({
  name: "contact",
  title: "Contact",
  type: "document",
  icon: User,
  components: {
    preview: (props) => <ContactPreview {...(props as ContactPreviewProps)} />,
  },
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      components: {
        field: (props) => (
          <span>
            Created{" "}
            {formatDistance(
              props.value ? new Date(props.value) : new Date(),
              new Date()
            )}{" "}
            ago
          </span>
        ),
      },
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      hidden: true,
    }),
    defineField({
      name: "audienceId",
      title: "Audience ID",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "subscribed",
      title: "Subscribed",
      type: "boolean",
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
    }),
  ],
  preview: {
    select: {
      email: "email",
      firstName: "firstName",
      lastName: "lastName",
      subscribed: "subscribed",
    },
    prepare({ email, firstName, lastName }) {
      const surname =
        lastName.localeCompare("-") === 0
          ? lastName
          : `${lastName.split("")[0].toUpperCase()}.`;

      const subtitle = `${firstName} ${surname}`;

      return {
        title: email,
        subtitle,
      };
    },
  },
});

interface ContactPreviewProps extends PreviewProps {
  email: string;
  firstName: string;
  lastName: string;
  subscribed: boolean;
}

export function ContactPreview({
  email,
  firstName = "-",
  lastName = "-",
  subscribed,
  ...props
}: ContactPreviewProps) {
  const surname =
    lastName.localeCompare("-") === 0
      ? lastName
      : `${lastName.split("")[0].toUpperCase()}.`;

  const subtitle = `${firstName} ${surname}`;

  return (
    <Flex align="center">
      <Box flex={1}>
        {props.renderDefault({ ...props, title: email, subtitle })}
      </Box>
      <Badge tone={subscribed ? "positive" : "critical"}>
        {subscribed ? "Subscribed" : "Unsubscribed"}
      </Badge>
    </Flex>
  );
}

export function ContactView({
  document,
  documentId,
  schemaType,
}: {
  document: any;
  documentId: any;
  schemaType: any;
}) {
  return (
    <div>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </div>
  );
}
