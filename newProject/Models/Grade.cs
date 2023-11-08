using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace newProject.Models;

public partial class Grade
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public int Id { get; set; }

    public int? IdExam { get; set; }

    public int? IdStudent { get; set; }

    public int? GradeExam { get; set; }

}
