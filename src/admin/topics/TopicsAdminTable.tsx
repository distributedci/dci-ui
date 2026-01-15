import { CopyIconButton } from "ui";
import { Label } from "@patternfly/react-core";
import type { IProduct, ITopic } from "types";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ActionsColumn,
  type IAction,
} from "@patternfly/react-table";
import { fromNow } from "services/date";
import { t_global_color_status_danger_default } from "@patternfly/react-tokens";
import { useUpdateTopicMutation } from "topics/topicsApi";
import ProductIcon from "products/ProductIcon";

interface IProductWithTopics extends IProduct {
  topics: ITopic[];
}

interface TopicsAdminTableProps {
  topicsPerProduct: IProductWithTopics[];
  onEdit: (topic: ITopic) => void;
}

export default function TopicsAdminTable({
  topicsPerProduct,
  onEdit,
}: TopicsAdminTableProps) {
  const [updateTopic] = useUpdateTopicMutation();

  const buildTopicActions = (topic: ITopic): IAction[] => {
    const actions: IAction[] = [
      {
        title: "Edit",
        onClick: () => onEdit(topic),
      },
    ];
    if (topic.state === "active") {
      actions.push({
        title: (
          <span style={{ color: t_global_color_status_danger_default.var }}>
            Deactivate
          </span>
        ),
        onClick: () => updateTopic({ ...topic, state: "inactive" }),
      });
    } else {
      actions.push({
        title: "Reactivate",
        onClick: () => updateTopic({ ...topic, state: "active" }),
      });
    }
    return actions;
  };

  return (
    <Table borders={false}>
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Product</Th>
          <Th>Name</Th>
          <Th className="text-center">Status</Th>
          <Th className="text-center">Export Control</Th>
          <Th>Created</Th>
          <Th className="text-center">Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {topicsPerProduct.flatMap((product) =>
          product.topics.map((topic) => {
            const topicActions = buildTopicActions(topic);
            return (
              <Tr key={`${topic.id}.${topic.etag}`}>
                <Td>
                  <span>
                    <CopyIconButton
                      text={topic.id}
                      textOnSuccess="copied"
                      className="pf-v6-u-mr-xs pointer"
                    />
                    {topic.id}
                  </span>
                </Td>
                <Td>
                  <span>
                    <ProductIcon
                      name={product.name}
                      className="pf-v6-u-mr-xs"
                    />
                    {product.name}
                  </span>
                </Td>
                <Td>{topic.name}</Td>
                <Td className="text-center">
                  {topic.state === "active" ? (
                    <Label color="green">active</Label>
                  ) : (
                    <Label color="red">inactive</Label>
                  )}
                </Td>
                <Td className="text-center">
                  {topic.export_control ? (
                    <Label color="green">yes</Label>
                  ) : (
                    <Label color="red">no</Label>
                  )}
                </Td>
                <Td>
                  <time title={topic.created_at} dateTime={topic.created_at}>
                    {fromNow(topic.created_at)}
                  </time>
                </Td>
                <Td className="text-center">
                  <ActionsColumn items={topicActions} />
                </Td>
              </Tr>
            );
          }),
        )}
      </Tbody>
    </Table>
  );
}
