import React from 'react';
import { Card, Button, Table, Badge, Dropdown } from 'react-bootstrap';
import { FileText, MoreHorizontal, Eye, Download, Plus } from 'lucide-react';
import { Document as AppDocument } from '../../../types';

interface DocumentsListProps {
  documents: AppDocument[];
  onView: (doc: AppDocument) => void;
  onDownload: (doc: AppDocument) => void;
  onDelete: (id: number) => void;
  onViewAll: () => void;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ documents, onView, onDownload, onDelete, onViewAll }) => (
  <Card className="sd-card-professional border-0">
    <div className="sd-card-header-clean d-flex justify-content-between align-items-center">
      <h5>Recent Documents</h5>
      <Button 
        variant="link" 
        className="text-primary small fw-bold text-decoration-none"
        onClick={onViewAll}
      >
        View all
      </Button>
    </div>
    <div className="p-0">
      <Table responsive hover className="mb-0 sd-table-pro">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Type</th>
            <th>Last Modified</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <div className="sd-doc-avatar">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="fw-bold small">{doc.title}</div>
                    <div className="extra-small text-muted">{doc.size}</div>
                  </div>
                </div>
              </td>
              <td>
                <Badge className="badge-pdf px-3 py-1">PDF Document</Badge>
              </td>
              <td className="small text-muted fw-medium">
                {new Date(doc.date).toLocaleDateString('fr-FR')}
              </td>
              <td className="text-end">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 no-caret text-muted">
                    <MoreHorizontal size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg small">
                    <Dropdown.Item className="d-flex align-items-center gap-2" onClick={() => onView(doc)}>
                      <Eye size={14} /> View
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center gap-2" onClick={() => onDownload(doc)}>
                      <Download size={14} /> Download
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger d-flex align-items-center gap-2" onClick={() => onDelete(doc.id)}>
                      <Plus size={14} className="rotate-45" /> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </Card>
);

export default DocumentsList;
