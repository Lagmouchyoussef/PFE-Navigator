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
  <Card className="glass-card border-0 shadow-sm border overflow-hidden">
    <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
      <h5 className="fw-bold mb-0 text-navy">Recent Documents</h5>
      <Button 
        variant="link" 
        className="text-primary extra-small fw-bold text-decoration-none p-0"
        onClick={onViewAll}
      >
        View all
      </Button>
    </div>
    <div className="table-responsive">
      <Table hover className="mb-0 align-middle">
        <thead className="bg-surface-alt">
          <tr>
            <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">File Name</th>
            <th className="py-3 extra-small fw-bold text-muted text-uppercase">Type</th>
            <th className="py-3 extra-small fw-bold text-muted text-uppercase">Last Modified</th>
            <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border-bottom border-light border-opacity-10">
              <td className="px-4 py-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-sm bg-primary-soft text-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="fw-bold small text-navy">{doc.title}</div>
                    <div className="extra-small text-muted fw-bold">{doc.size}</div>
                  </div>
                </div>
              </td>
              <td>
                <Badge className="bg-danger-soft text-danger border-0 px-3 py-1 extra-small fw-bold">PDF Document</Badge>
              </td>
              <td className="small text-muted fw-bold">
                {new Date(doc.date).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-4 py-3 text-end">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 no-caret text-muted">
                    <MoreHorizontal size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg extra-small rounded-4">
                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => onView(doc)}>
                      <Eye size={14} className="text-primary" /> View
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => onDownload(doc)}>
                      <Download size={14} className="text-success" /> Download
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger d-flex align-items-center gap-2 py-2" onClick={() => onDelete(doc.id)}>
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
