import { useState } from "react";
import { FiPlus, FiTrash, FiEdit, FiX } from "react-icons/fi";
import styles from "@/styles/CategoryManager.module.css";
import { useStore } from "@/app/lib/store";

const CategoryManager = () => {
  const { categories, addCategory, deleteCategory } = useStore();
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#3b82f6",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (!newCategory.name) return;
    addCategory(newCategory);
    setNewCategory({ name: "", color: "#3b82f6" });
  };

  return (
    <div className={styles.managerContainer}>
      <h3>Manage Categories</h3>

      <div className={styles.categoryList}>
        {categories.map((category) => (
          <div key={category.id} className={styles.categoryItem}>
            {editingId === category.id ? (
              <>
                <input
                  type="color"
                  value={category.color}
                  onChange={(e) =>
                    addCategory({ ...category, color: e.target.value })
                  }
                />
                <input
                  value={category.name}
                  onChange={(e) =>
                    addCategory({ ...category, name: e.target.value })
                  }
                />
                <button onClick={() => setEditingId(null)}>
                  <FiX />
                </button>
              </>
            ) : (
              <>
                <div
                  className={styles.colorPreview}
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
                <div className={styles.actions}>
                  <button onClick={() => setEditingId(category.id)}>
                    <FiEdit />
                  </button>
                  <button onClick={() => deleteCategory(category.id)}>
                    <FiTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.addSection}>
        <input
          placeholder="New category name"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
        />
        <input
          type="color"
          value={newCategory.color}
          onChange={(e) =>
            setNewCategory({ ...newCategory, color: e.target.value })
          }
        />
        <button onClick={handleAddCategory} className={styles.addButton}>
          <FiPlus /> Add Category
        </button>
      </div>
    </div>
  );
};

export default CategoryManager;
