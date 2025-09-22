import { Input, Table } from "@aws-amplify/ui-react"
import type { Tank, TankExtended } from "../types/TankType"
import { PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"

type Props = {
  tanks: TankExtended[]
  onDelete?: (id: string) => void
  onAdd?: (tank: Tank) => void
}

export default function ShowTanks({tanks, onDelete, onAdd}: Props) {

  const [newTank, setNewTank] = useState<Tank>({
    tank: '',
    tankType: '',
    fish: ''
  })

  const handleDelete = (id: string | undefined) => {
    if (id && onDelete) {
      onDelete(id)
    }
  }

  const handleAdd = () => {
    if (onAdd) {
      onAdd(newTank)
      setNewTank({
        tank: '',
        tankType: '',
        fish: ''
      })
    }
  }

  const updateTankField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setNewTank({ ...newTank, [name]: value })
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Fish Tanks</h1>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Tank Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Fish</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tanks.map((tank, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tank.tank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {tank.tankType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tank.fish || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => handleDelete(tank.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-150 p-1 rounded hover:bg-red-50"
                    title="Delete tank"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-25 border-t-2 border-gray-200">
              <td className="px-6 py-4">
                <Input
                  name="tank"
                  value={newTank.tank ?? ''}
                  onChange={updateTankField}
                  placeholder="Enter tank name"
                  className="w-full"
                />
              </td>
              <td className="px-6 py-4">
                <Input
                  name="tankType"
                  value={newTank.tankType ?? ''}
                  onChange={updateTankField}
                  placeholder="Freshwater, Saltwater, etc."
                  className="w-full"
                />
              </td>
              <td className="px-6 py-4">
                <Input
                  name="fish"
                  value={newTank.fish ?? ''}
                  onChange={updateTankField}
                  placeholder="Enter fish type"
                  className="w-full"
                />
              </td>
              <td className="px-6 py-4">
                <button 
                  className="text-green-500 hover:text-green-700 transition-colors duration-150 p-1 rounded hover:bg-green-50"
                  onClick={() => handleAdd()}
                  title="Add new tank"
                >
                  <PlusCircle size={16} />
                </button>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  )
}