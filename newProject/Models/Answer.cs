using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace newProject.Models;

public partial class Answer
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

    public int Id { get; set; }

    public int? IdQuestion { get; set; }

    public string? AnswerText { get; set; }

  
    public virtual Question? IdQuestionNavigation { get; set; }
}
